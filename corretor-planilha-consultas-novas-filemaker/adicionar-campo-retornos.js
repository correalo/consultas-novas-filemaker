#!/usr/bin/env node

/**
 * Script para adicionar o campo "retornos" em todos os documentos
 */

const { MongoClient } = require('mongodb');

// Configurações
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'consultas_db';
const COLLECTION_NAME = 'consultas-novas-filemaker';

/**
 * Conecta ao MongoDB
 */
async function connectToMongoDB() {
    try {
        console.log('🔌 Conectando ao MongoDB...');
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        await client.db('admin').command({ ping: 1 });
        console.log('✓ Conectado ao MongoDB\n');
        return client;
    } catch (error) {
        console.error(`✗ Erro ao conectar ao MongoDB: ${error.message}`);
        process.exit(1);
    }
}

/**
 * Adiciona o campo retornos
 */
async function adicionarCampoRetornos(client) {
    try {
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        console.log('📊 Verificando documentos...\n');
        
        // Conta total de documentos
        const totalDocumentos = await collection.countDocuments();
        console.log(`✓ Total de documentos na coleção: ${totalDocumentos}\n`);
        
        // Conta documentos que já têm o campo retornos
        const comRetornos = await collection.countDocuments({ 
            'retornos': { $exists: true } 
        });
        
        console.log(`✓ Documentos que já têm o campo "retornos": ${comRetornos}`);
        console.log(`✓ Documentos que precisam do campo "retornos": ${totalDocumentos - comRetornos}\n`);
        
        if (totalDocumentos === comRetornos) {
            console.log('⚠ Todos os documentos já possuem o campo "retornos"');
            return;
        }
        
        console.log('🔧 Adicionando campo "retornos"...\n');
        
        // Adiciona o campo retornos como array vazio para documentos que não têm
        const resultado = await collection.updateMany(
            { 'retornos': { $exists: false } },
            { 
                $set: { 
                    'retornos': [],
                    '_campo_retornos_criado_em': new Date()
                } 
            }
        );
        
        console.log('='.repeat(60));
        console.log('✅ CAMPO "RETORNOS" ADICIONADO COM SUCESSO!');
        console.log('='.repeat(60));
        console.log(`Total de documentos: ${totalDocumentos}`);
        console.log(`Documentos atualizados: ${resultado.modifiedCount}`);
        console.log(`Documentos que já tinham o campo: ${comRetornos}`);
        console.log();
        
        // Mostra alguns exemplos
        console.log('📋 Exemplos de documentos com o campo "retornos":');
        const exemplos = await collection.find({
            '_campo_retornos_criado_em': { $exists: true }
        }).limit(3).toArray();
        
        exemplos.forEach((doc, index) => {
            console.log(`\n  ${index + 1}. Nome: ${doc.NOME || 'N/A'}`);
            console.log(`     Retornos: ${JSON.stringify(doc.retornos)}`);
            console.log(`     Campo criado em: ${doc._campo_retornos_criado_em}`);
        });
        
    } catch (error) {
        console.error(`✗ Erro ao adicionar campo: ${error.message}`);
        throw error;
    }
}

/**
 * Função principal
 */
async function main() {
    console.log('='.repeat(60));
    console.log('ADICIONAR CAMPO "RETORNOS" NA COLEÇÃO');
    console.log('='.repeat(60));
    console.log();
    
    let client;
    
    try {
        client = await connectToMongoDB();
        await adicionarCampoRetornos(client);
        
    } catch (error) {
        console.error('✗ Erro:', error.message);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
            console.log('\n🔌 Conexão fechada');
        }
    }
}

// Executa o script
main();
