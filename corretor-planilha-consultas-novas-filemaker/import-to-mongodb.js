#!/usr/bin/env node

/**
 * Script para importar dados da planilha Excel para MongoDB
 */

const XLSX = require('xlsx');
const { MongoClient } = require('mongodb');
const readline = require('readline');

// Configurações
const EXCEL_FILE = 'consultas-novas-filemaker.xlsx';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'consultas_db';
const COLLECTION_NAME = 'consultas-novas-filemaker';

/**
 * Lê o arquivo Excel e retorna os dados
 */
function readExcelFile(filePath) {
    try {
        console.log('📖 Lendo arquivo Excel...');
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Converte para JSON
        const data = XLSX.utils.sheet_to_json(worksheet, {
            raw: false,
            dateNF: 'yyyy-mm-dd'
        });
        
        console.log(`✓ Arquivo lido com sucesso: ${data.length} registros encontrados`);
        
        // Mostra as colunas
        if (data.length > 0) {
            const columns = Object.keys(data[0]);
            console.log(`✓ Colunas: ${columns.join(', ')}`);
        }
        
        return data;
    } catch (error) {
        console.error(`✗ Erro ao ler arquivo Excel: ${error.message}`);
        process.exit(1);
    }
}

/**
 * Conecta ao MongoDB
 */
async function connectToMongoDB() {
    try {
        console.log('🔌 Conectando ao MongoDB...');
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        
        // Testa a conexão
        await client.db('admin').command({ ping: 1 });
        console.log(`✓ Conectado ao MongoDB`);
        
        return client;
    } catch (error) {
        console.error(`✗ Erro ao conectar ao MongoDB: ${error.message}`);
        console.error('  Certifique-se de que o MongoDB está rodando:');
        console.error('  brew services start mongodb-community');
        process.exit(1);
    }
}

/**
 * Pergunta ao usuário
 */
function askQuestion(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

/**
 * Prepara os dados para inserção
 */
function prepareData(data) {
    return data.map(record => ({
        ...record,
        _imported_at: new Date()
    }));
}

/**
 * Importa os dados para o MongoDB
 */
async function importToMongoDB(client, data) {
    try {
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        // Verifica se já existem documentos
        const existingCount = await collection.countDocuments();
        
        if (existingCount > 0) {
            console.log(`⚠ A coleção '${COLLECTION_NAME}' já possui ${existingCount} documentos.`);
            const answer = await askQuestion('Deseja limpar a coleção antes de importar? (s/n): ');
            
            if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'sim') {
                await collection.deleteMany({});
                console.log('✓ Coleção limpa');
            }
        }
        
        // Prepara os dados
        const records = prepareData(data);
        
        // Insere os documentos
        if (records.length > 0) {
            console.log('📥 Importando dados...');
            const result = await collection.insertMany(records);
            console.log(`✓ ${result.insertedCount} documentos inseridos na coleção '${COLLECTION_NAME}'`);
            return result.insertedCount;
        } else {
            console.log('⚠ Nenhum registro para inserir');
            return 0;
        }
        
    } catch (error) {
        console.error(`✗ Erro ao importar dados: ${error.message}`);
        throw error;
    }
}

/**
 * Cria índices na coleção
 */
async function createIndexes(client) {
    try {
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        // Cria índice no timestamp de importação
        await collection.createIndex({ _imported_at: -1 });
        console.log('✓ Índices criados');
        
    } catch (error) {
        console.warn(`⚠ Aviso ao criar índices: ${error.message}`);
    }
}

/**
 * Função principal
 */
async function main() {
    console.log('='.repeat(60));
    console.log('IMPORTAÇÃO DE DADOS EXCEL PARA MONGODB');
    console.log('='.repeat(60));
    console.log();
    
    let client;
    
    try {
        // Passo 1: Ler arquivo Excel
        const data = readExcelFile(EXCEL_FILE);
        console.log();
        
        // Passo 2: Conectar ao MongoDB
        client = await connectToMongoDB();
        console.log();
        
        // Passo 3: Importar dados
        console.log('💾 Importando para MongoDB...');
        const count = await importToMongoDB(client, data);
        console.log();
        
        // Passo 4: Criar índices
        console.log('🔧 Criando índices...');
        await createIndexes(client);
        console.log();
        
        // Resumo
        console.log('='.repeat(60));
        console.log('✅ IMPORTAÇÃO CONCLUÍDA COM SUCESSO!');
        console.log('='.repeat(60));
        console.log(`Banco de dados: ${DATABASE_NAME}`);
        console.log(`Coleção: ${COLLECTION_NAME}`);
        console.log(`Documentos importados: ${count}`);
        console.log();
        console.log('Para visualizar os dados no MongoDB:');
        console.log(`  mongosh ${DATABASE_NAME}`);
        console.log(`  db['${COLLECTION_NAME}'].find().limit(5)`);
        console.log();
        
    } catch (error) {
        console.error('✗ Erro durante a importação:', error.message);
        process.exit(1);
    } finally {
        // Fecha conexão
        if (client) {
            await client.close();
            console.log('🔌 Conexão fechada');
        }
    }
}

// Executa o script
main();
