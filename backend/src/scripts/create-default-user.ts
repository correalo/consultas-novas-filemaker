import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    // Criar usuário padrão
    const defaultUser = {
      email: 'correalo@uol.com.br',
      password: 'Anatomia531@',
      name: 'Correalo Admin',
    };

    console.log('Criando usuário padrão...');
    await authService.register(defaultUser);
    console.log('✅ Usuário padrão criado com sucesso!');
    console.log(`Email: ${defaultUser.email}`);
    console.log(`Senha: ${defaultUser.password}`);
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log('ℹ️  Usuário já existe no banco de dados');
    } else {
      console.error('❌ Erro ao criar usuário:', error.message);
    }
  } finally {
    await app.close();
  }
}

bootstrap();
