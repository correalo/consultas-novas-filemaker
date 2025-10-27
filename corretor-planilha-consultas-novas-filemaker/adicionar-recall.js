#!/usr/bin/env node

/**
 * Script para adicionar área de recall com períodos de 1 a 7
 */

const { MongoClient } = require('mongodb');

// Configurações
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'consultas_db';
const COLLECTION_NAME = 'consultas-novas-filemaker';

// Períodos de recall (1 a 7)
const PERIODOS_RECALL = [
    { periodo: 1 },
    { periodo: 2 },
    { periodo: 3 },
    { periodo: 4 },
    { periodo: 5 },
    { periodo: 6 },
    { periodo: 7 }
];

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
 * Adiciona a área de recall
 */
async function adicionarRecall(client) {
    try {
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        console.log('📊 Verificando documentos...\n');
        
        // Conta total de documentos
        const totalDocumentos = await collection.countDocuments();
        console.log(`✓ Total de documentos na coleção: ${totalDocumentos}\n`);
        
        console.log('📋 Períodos de recall que serão adicionados:');
        PERIODOS_RECALL.forEach((p, index) => {
            console.log(`  ${index + 1}. Recall ${p.periodo}`);
        });
        console.log();
        
        console.log('🔧 Adicionando área de recall...\n');
        
        // Busca todos os documentos
        const documentos = await collection.find().toArray();
        
        let atualizados = 0;
        let erros = 0;
        
        for (const doc of documentos) {
            try {
                // Cria o array de recall com os períodos predefinidos
                const recall = PERIODOS_RECALL.map(p => {
                    return {
                        periodo: p.periodo,
                        status: 'pendente',
                        observacao: '',
                        contato_realizado: false,
                        // Contatos por WhatsApp (5 tentativas)
                        whatsapp_contato_1: false,
                        whatsapp_data_1: null,
                        whatsapp_contato_2: false,
                        whatsapp_data_2: null,
                        whatsapp_contato_3: false,
                        whatsapp_data_3: null,
                        whatsapp_contato_4: false,
                        whatsapp_data_4: null,
                        whatsapp_contato_5: false,
                        whatsapp_data_5: null,
                        // Contatos por Ligação (5 tentativas)
                        ligacao_contato_1: false,
                        ligacao_data_1: null,
                        ligacao_contato_2: false,
                        ligacao_data_2: null,
                        ligacao_contato_3: false,
                        ligacao_data_3: null,
                        ligacao_contato_4: false,
                        ligacao_data_4: null,
                        ligacao_contato_5: false,
                        ligacao_data_5: null
                    };
                });
                
                // Atualiza o documento
                await collection.updateOne(
                    { _id: doc._id },
                    { 
                        $set: { 
                            'recall': recall,
                            '_recall_criado_em': new Date()
                        } 
                    }
                );
                
                atualizados++;
                
                // Mostra progresso a cada 500 documentos
                if (atualizados % 500 === 0) {
                    console.log(`  ⏳ Processados: ${atualizados}/${totalDocumentos}`);
                }
                
            } catch (error) {
                console.error(`✗ Erro ao atualizar documento ${doc._id}: ${error.message}`);
                erros++;
            }
        }
        
        console.log();
        console.log('='.repeat(60));
        console.log('✅ ÁREA DE RECALL ADICIONADA COM SUCESSO!');
        console.log('='.repeat(60));
        console.log(`Total de documentos: ${totalDocumentos}`);
        console.log(`Documentos atualizados: ${atualizados}`);
        if (erros > 0) {
            console.log(`Erros: ${erros}`);
        }
        console.log();
        
        // Mostra alguns exemplos
        console.log('📋 Exemplo de documento com área de recall:');
        const exemplo = await collection.findOne({
            '_recall_criado_em': { $exists: true }
        });
        
        if (exemplo) {
            console.log(`\n  Nome: ${exemplo.NOME || 'N/A'}`);
            console.log(`  Total de períodos de recall: ${exemplo.recall.length}`);
            console.log('\n  Primeiros 3 períodos:');
            exemplo.recall.slice(0, 3).forEach((rec, index) => {
                console.log(`    ${index + 1}. Recall ${rec.periodo} - Status: ${rec.status} - Contato realizado: ${rec.contato_realizado}`);
            });
            
            console.log('\n  Estrutura do Recall 1:');
            const campos = Object.keys(exemplo.recall[0]);
            console.log(`    Total de campos: ${campos.length}`);
            console.log(`    Campos WhatsApp: ${campos.filter(c => c.startsWith('whatsapp')).length}`);
            console.log(`    Campos Ligação: ${campos.filter(c => c.startsWith('ligacao')).length}`);
        }
        
    } catch (error) {
        console.error(`✗ Erro ao adicionar recall: ${error.message}`);
        throw error;
    }
}

/**
 * Função principal
 */
async function main() {
    console.log('='.repeat(60));
    console.log('ADICIONAR ÁREA DE RECALL NA COLEÇÃO');
    console.log('='.repeat(60));
    console.log();
    
    let client;
    
    try {
        client = await connectToMongoDB();
        await adicionarRecall(client);
        
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
