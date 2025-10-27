#!/usr/bin/env node

/**
 * Script para corrigir telefones fixos adicionando DD3 na frente (execução automática)
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
 * Limpa e formata o número de telefone
 */
function formatarTelefone(ddd, telefone) {
    if (!ddd || !telefone) {
        return telefone;
    }
    
    // Remove espaços e caracteres especiais
    const dddLimpo = String(ddd).replace(/\D/g, '');
    const telefoneLimpo = String(telefone).replace(/\D/g, '');
    
    // Se o telefone já começa com o DDD, não adiciona novamente
    if (telefoneLimpo.startsWith(dddLimpo)) {
        return telefone;
    }
    
    // Adiciona o DDD na frente
    return dddLimpo + telefoneLimpo;
}

/**
 * Corrige os telefones fixos
 */
async function corrigirTelefones(client) {
    try {
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        console.log('📊 Analisando documentos...\n');
        
        // Busca todos os documentos que têm TEL FIXO e DD3
        const documentos = await collection.find({
            'TEL FIXO': { $exists: true, $ne: null, $ne: '' },
            'DD3': { $exists: true, $ne: null, $ne: '' }
        }).toArray();
        
        console.log(`✓ Encontrados ${documentos.length} documentos com telefone fixo e DD3\n`);
        
        if (documentos.length === 0) {
            console.log('⚠ Nenhum documento para corrigir');
            return;
        }
        
        // Mostra alguns exemplos antes da correção
        console.log('📋 Exemplos ANTES da correção:');
        for (let i = 0; i < Math.min(5, documentos.length); i++) {
            const doc = documentos[i];
            console.log(`  ${i + 1}. DD3: "${doc.DD3}" | Tel Fixo: "${doc['TEL FIXO']}"`);
        }
        console.log();
        
        console.log('🔧 Corrigindo telefones...\n');
        
        let corrigidos = 0;
        let jaCorretos = 0;
        let erros = 0;
        
        // Atualiza cada documento
        for (const doc of documentos) {
            try {
                const telefoneOriginal = doc['TEL FIXO'];
                const telefoneCorrigido = formatarTelefone(doc.DD3, telefoneOriginal);
                
                // Só atualiza se o telefone foi modificado
                if (telefoneCorrigido !== telefoneOriginal) {
                    await collection.updateOne(
                        { _id: doc._id },
                        { 
                            $set: { 
                                'TEL FIXO': telefoneCorrigido,
                                '_telefone_corrigido_em': new Date()
                            } 
                        }
                    );
                    corrigidos++;
                } else {
                    jaCorretos++;
                }
            } catch (error) {
                console.error(`✗ Erro ao corrigir documento ${doc._id}: ${error.message}`);
                erros++;
            }
        }
        
        console.log('='.repeat(60));
        console.log('✅ CORREÇÃO CONCLUÍDA!');
        console.log('='.repeat(60));
        console.log(`Total de documentos analisados: ${documentos.length}`);
        console.log(`Telefones corrigidos: ${corrigidos}`);
        console.log(`Telefones já corretos: ${jaCorretos}`);
        if (erros > 0) {
            console.log(`Erros: ${erros}`);
        }
        console.log();
        
        // Mostra alguns exemplos depois da correção
        if (corrigidos > 0) {
            console.log('📋 Exemplos DEPOIS da correção:');
            const documentosAtualizados = await collection.find({
                '_telefone_corrigido_em': { $exists: true }
            }).limit(5).toArray();
            
            for (let i = 0; i < documentosAtualizados.length; i++) {
                const doc = documentosAtualizados[i];
                console.log(`  ${i + 1}. DD3: "${doc.DD3}" | Tel Fixo: "${doc['TEL FIXO']}"`);
            }
        }
        
    } catch (error) {
        console.error(`✗ Erro durante a correção: ${error.message}`);
        throw error;
    }
}

/**
 * Função principal
 */
async function main() {
    console.log('='.repeat(60));
    console.log('CORREÇÃO DE TELEFONES FIXOS - ADICIONAR DD3');
    console.log('='.repeat(60));
    console.log();
    
    let client;
    
    try {
        client = await connectToMongoDB();
        await corrigirTelefones(client);
        
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
