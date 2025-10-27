#!/usr/bin/env node

/**
 * Script para adicionar períodos de retorno predefinidos
 */

const { MongoClient } = require('mongodb');

// Configurações
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'consultas_db';
const COLLECTION_NAME = 'consultas-novas-filemaker';

// Períodos de retorno predefinidos
const PERIODOS_RETORNO = [
    { periodo: '7 dias', dias: 7, semExames: true },
    { periodo: '30 dias', dias: 30, semExames: true },
    { periodo: '3 meses', dias: 90 },
    { periodo: '6 meses', dias: 180 },
    { periodo: '9 meses', dias: 270 },
    { periodo: '12 meses', dias: 365 },
    { periodo: '15 meses', dias: 455 },
    { periodo: '18 meses', dias: 545 },
    { periodo: '2 anos', dias: 730 },
    { periodo: '3 anos', dias: 1095 },
    { periodo: '4 anos', dias: 1460 },
    { periodo: '5 anos', dias: 1825 },
    { periodo: '6 anos', dias: 2190 },
    { periodo: '7 anos', dias: 2555 },
    { periodo: '8 anos', dias: 2920 },
    { periodo: '9 anos', dias: 3285 },
    { periodo: '10 anos', dias: 3650 },
    { periodo: '11 anos', dias: 4015 },
    { periodo: '12 anos', dias: 4380 }
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
 * Calcula a data de retorno baseada na data da consulta
 */
function calcularDataRetorno(dataConsulta, dias) {
    if (!dataConsulta) return null;
    
    const data = new Date(dataConsulta);
    if (isNaN(data.getTime())) return null;
    
    const dataRetorno = new Date(data);
    dataRetorno.setDate(dataRetorno.getDate() + dias);
    
    return dataRetorno;
}

/**
 * Adiciona os períodos de retorno
 */
async function adicionarPeriodosRetornos(client) {
    try {
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        console.log('📊 Verificando documentos...\n');
        
        // Conta total de documentos
        const totalDocumentos = await collection.countDocuments();
        console.log(`✓ Total de documentos na coleção: ${totalDocumentos}\n`);
        
        console.log('📋 Períodos de retorno que serão adicionados:');
        PERIODOS_RETORNO.forEach((p, index) => {
            console.log(`  ${index + 1}. ${p.periodo} (${p.dias} dias)`);
        });
        console.log();
        
        console.log('🔧 Adicionando períodos de retorno...\n');
        
        // Busca todos os documentos
        const documentos = await collection.find().toArray();
        
        let atualizados = 0;
        let erros = 0;
        
        for (const doc of documentos) {
            try {
                // Cria o array de retornos com os períodos predefinidos
                const retornos = PERIODOS_RETORNO.map(p => {
                    const dataRetorno = calcularDataRetorno(doc['DATA DA CONSULTA'], p.dias);
                    
                    // Cria os nomes dos campos dinamicamente
                    const nomeCampoPrevista = `data_prevista_${p.periodo.replace(/ /g, '_')}`;
                    const nomeCampoRealizado = `data_realizado_${p.periodo.replace(/ /g, '_')}`;
                    
                    const retorno = {
                        periodo: p.periodo,
                        dias: p.dias,
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
                    
                    // Adiciona os campos de data com nomes dinâmicos
                    retorno[nomeCampoPrevista] = dataRetorno;
                    retorno[nomeCampoRealizado] = null;
                    
                    // Adiciona campo de exames apenas se não for 7 dias ou 30 dias
                    if (!p.semExames) {
                        const nomeCampoExames = `data_de_exames_${p.periodo.replace(/ /g, '_')}`;
                        retorno[nomeCampoExames] = null;
                    }
                    
                    return retorno;
                });
                
                // Atualiza o documento
                await collection.updateOne(
                    { _id: doc._id },
                    { 
                        $set: { 
                            'retornos': retornos,
                            '_retornos_atualizados_em': new Date()
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
        console.log('✅ PERÍODOS DE RETORNO ADICIONADOS COM SUCESSO!');
        console.log('='.repeat(60));
        console.log(`Total de documentos: ${totalDocumentos}`);
        console.log(`Documentos atualizados: ${atualizados}`);
        if (erros > 0) {
            console.log(`Erros: ${erros}`);
        }
        console.log();
        
        // Mostra alguns exemplos
        console.log('📋 Exemplo de documento com períodos de retorno:');
        const exemplo = await collection.findOne({
            '_retornos_atualizados_em': { $exists: true }
        });
        
        if (exemplo) {
            console.log(`\n  Nome: ${exemplo.NOME || 'N/A'}`);
            console.log(`  Data da Consulta: ${exemplo['DATA DA CONSULTA'] || 'N/A'}`);
            console.log(`  Total de períodos de retorno: ${exemplo.retornos.length}`);
            console.log('\n  Primeiros 5 períodos:');
            exemplo.retornos.slice(0, 5).forEach((ret, index) => {
                console.log(`    ${index + 1}. ${ret.periodo} - Data prevista: ${ret.data_prevista ? new Date(ret.data_prevista).toLocaleDateString('pt-BR') : 'N/A'} - Status: ${ret.status}`);
            });
        }
        
    } catch (error) {
        console.error(`✗ Erro ao adicionar períodos: ${error.message}`);
        throw error;
    }
}

/**
 * Função principal
 */
async function main() {
    console.log('='.repeat(60));
    console.log('ADICIONAR PERÍODOS DE RETORNO NA COLEÇÃO');
    console.log('='.repeat(60));
    console.log();
    
    let client;
    
    try {
        client = await connectToMongoDB();
        await adicionarPeriodosRetornos(client);
        
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
