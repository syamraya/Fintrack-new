import { 
  ConflictException, 
  Injectable, 
  InternalServerErrorException, 
  BadRequestException, 
  NotFoundException, 
  UnauthorizedException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto'; 
import { VerifyRegisterDto } from './dto/verify-register.dto'; 
import { Prisma } from '@prisma/client';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) throw new ConflictException('Email ini sudah terdaftar, bre!');
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);
    
    await this.prisma.passwordReset.create({
      data: { email: dto.email, otp, expiresAt },
    });

    try {
     await this.mailService.sendMail(
  dto.email,
  'Verify your FinTrack Account',
  `
  <div style="background:#f5f4f0;padding:48px 20px;font-family:Georgia,serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e8e6e0;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
      
      <!-- Header -->
      <div style="padding:24px 36px;border-bottom:1px solid #f0ede8;display:flex;justify-content:space-between;align-items:center;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:32px;height:32px;background:#1a1a18;border-radius:8px;display:flex;align-items:center;justify-content:center;font-style:italic;color:#fff;font-size:14px;">F</div>
          <span style="font-style:italic;font-size:17px;color:#1a1a18;letter-spacing:-0.3px;">FinTrack</span>
        </div>
        <span style="font-family:monospace;font-size:10px;color:#aaa89f;letter-spacing:0.5px;">ACCOUNT VERIFICATION</span>
      </div>

      <!-- Body -->
      <div style="padding:36px 36px 28px;">
        <p style="font-family:monospace;font-size:10px;letter-spacing:2px;color:#aaa89f;text-transform:uppercase;margin:0 0 10px;">Account Verification</p>
        <h1 style="font-style:italic;font-size:26px;font-weight:400;color:#1a1a18;line-height:1.25;letter-spacing:-0.5px;margin:0 0 12px;">Verify your<br/><em>email address.</em></h1>
        <p style="font-size:14px;font-weight:300;color:#6b6860;line-height:1.75;margin:0 0 32px;">
          Welcome! Enter the one-time code below to activate your <strong style="color:#1a1a18;font-weight:500;">FinTrack</strong> account. This code is valid for 5 minutes and can only be used once.
        </p>

        <!-- OTP Block -->
        <div style="border:1px solid #e8e6e0;border-radius:12px;overflow:hidden;margin-bottom:28px;">
          <div style="padding:16px 24px;background:#fafaf8;border-bottom:1px solid #f0ede8;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-family:monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#aaa89f;">One-Time Code</span>
            <span style="font-family:monospace;font-size:11px;color:#c0392b;">⏱ 5 min</span>
          </div>
          <div style="padding:28px 24px;text-align:center;">
            <div style="display:inline-flex;gap:6px;align-items:center;">
              ${otp.split('').slice(0,3).map(d => `<div style="width:48px;height:60px;background:#fff;border:1px solid #e8e6e0;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-family:monospace;font-size:26px;font-weight:500;color:#1a1a18;box-shadow:0 1px 3px rgba(0,0,0,0.04);">${d}</div>`).join('')}
              <span style="font-family:monospace;font-size:20px;color:#e8e6e0;margin:0 4px;">·</span>
              ${otp.split('').slice(3,6).map(d => `<div style="width:48px;height:60px;background:#fff;border:1px solid #e8e6e0;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-family:monospace;font-size:26px;font-weight:500;color:#1a1a18;box-shadow:0 1px 3px rgba(0,0,0,0.04);">${d}</div>`).join('')}
            </div>
          </div>
        </div>

        <!-- Notice -->
        <div style="background:#f0f7f3;border:1px solid #c8dfd4;border-radius:10px;padding:14px 16px;margin-bottom:24px;display:flex;gap:10px;">
          <span style="color:#2d6a4f;font-size:14px;">✓</span>
          <span style="font-size:13px;color:#2d6a4f;line-height:1.6;">Once verified, your account will be active and you can start tracking your finances right away.</span>
        </div>

        <hr style="border:none;border-top:1px solid #f0ede8;margin:4px 0 24px;"/>
        <p style="font-size:12px;font-weight:300;color:#aaa89f;line-height:1.7;margin:0;">
          Didn't create a FinTrack account? You can safely ignore this email — your code will expire automatically.
        </p>
      </div>

      <!-- Footer -->
      <div style="padding:18px 36px 24px;border-top:1px solid #f0ede8;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:monospace;font-size:10px;color:#aaa89f;letter-spacing:0.5px;">© 2026 FINTRACK</span>
        <span style="font-family:monospace;font-size:10px;color:#aaa89f;">fintrack.app</span>
      </div>

    </div>
  </div>
  `
);

      return { message: 'Verification code sent! Please check your inbox or spam folder.' };
    } catch (error) {
      console.error('======= DEBUG SMTP REGISTER ERROR =======');
      console.error(error);
      console.error('=========================================');
      throw new BadRequestException('Failed to send verification email. Please make sure your email is valid!');
    }
  }

  async verifyRegister(dto: VerifyRegisterDto) {
    const resetRecord = await this.prisma.passwordReset.findFirst({
      where: { email: dto.email, otp: dto.otp },
      orderBy: { createdAt: 'desc' },
    });

    if (!resetRecord) {
      throw new BadRequestException('Invalid OTP code. Please try again!');
    }

    const now = new Date();
    if (now > resetRecord.expiresAt) {
      throw new BadRequestException('OTP code has expired. Please register again!');
    }

    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10); 
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hashedPassword,
          role: 'USER', 
        },
      });
      await this.prisma.passwordReset.deleteMany({ where: { email: dto.email } });
      const { password, ...result } = user;
      return {
        message: 'Email verified successfully! Your account is now active. Please login.',
        data: result,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('This email is already registered.');
      }
      throw new InternalServerErrorException('Failed to create account. Please try again later.');
    }
  }

  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance: user.balance
      }
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('Email not found in our system!');
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);
    
    await this.prisma.passwordReset.create({
      data: { email: dto.email, otp, expiresAt },
    });

    try {
      await this.mailService.sendMail(
  dto.email,
  'Reset your FinTrack Password',
  `
  <div style="background:#f5f4f0;padding:48px 20px;font-family:Georgia,serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e8e6e0;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
      
      <!-- Header -->
      <div style="padding:24px 36px;border-bottom:1px solid #f0ede8;display:flex;justify-content:space-between;align-items:center;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:32px;height:32px;background:#1a1a18;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-style:italic;color:#fff;font-size:14px;">F</div>
          <span style="font-style:italic;font-size:17px;color:#1a1a18;letter-spacing:-0.3px;">FinTrack</span>
        </div>
        <span style="font-family:monospace;font-size:10px;color:#aaa89f;letter-spacing:0.5px;">PASSWORD RESET</span>
      </div>

      <!-- Body -->
      <div style="padding:36px 36px 28px;">
        <p style="font-family:monospace;font-size:10px;letter-spacing:2px;color:#aaa89f;text-transform:uppercase;margin:0 0 10px;">Password Reset</p>
        <h1 style="font-style:italic;font-size:26px;font-weight:400;color:#1a1a18;line-height:1.25;letter-spacing:-0.5px;margin:0 0 12px;">Reset your<br/><em>password.</em></h1>
        <p style="font-size:14px;font-weight:300;color:#6b6860;line-height:1.75;margin:0 0 32px;">
          Hi <strong style="color:#1a1a18;font-weight:500;">${user.name || 'there'}</strong> — we received a request to reset the password on your FinTrack account. Use the code below to set a new one.
        </p>

        <!-- OTP Block -->
        <div style="border:1px solid #e8e6e0;border-radius:12px;overflow:hidden;margin-bottom:28px;">
          <div style="padding:16px 24px;background:#fafaf8;border-bottom:1px solid #f0ede8;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-family:monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#aaa89f;">Reset Code</span>
            <span style="font-family:monospace;font-size:11px;color:#c0392b;">⏱ 5 min</span>
          </div>
          <div style="padding:28px 24px;text-align:center;">
            <div style="display:inline-flex;gap:6px;align-items:center;">
              ${otp.split('').slice(0,3).map(d => `<div style="width:48px;height:60px;background:#fff;border:1px solid #e8e6e0;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-family:monospace;font-size:26px;font-weight:500;color:#1a1a18;box-shadow:0 1px 3px rgba(0,0,0,0.04);">${d}</div>`).join('')}
              <span style="font-family:monospace;font-size:20px;color:#e8e6e0;margin:0 4px;">·</span>
              ${otp.split('').slice(3,6).map(d => `<div style="width:48px;height:60px;background:#fff;border:1px solid #e8e6e0;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-family:monospace;font-size:26px;font-weight:500;color:#1a1a18;box-shadow:0 1px 3px rgba(0,0,0,0.04);">${d}</div>`).join('')}
            </div>
          </div>
        </div>

        <!-- Notice -->
        <div style="background:#fdf4f3;border:1px solid #f0c8c3;border-radius:10px;padding:14px 16px;margin-bottom:24px;display:flex;gap:10px;">
          <span style="color:#922b21;font-size:14px;">!</span>
          <span style="font-size:13px;color:#922b21;line-height:1.6;">If you didn't request this, your account is safe — simply ignore this email. Your password won't change unless this code is used.</span>
        </div>

        <hr style="border:none;border-top:1px solid #f0ede8;margin:4px 0 24px;"/>
        <p style="font-size:12px;font-weight:300;color:#aaa89f;line-height:1.7;margin:0;">
          For your security, this code expires in 5 minutes and is single-use only. Never share this code with anyone.
        </p>
      </div>

      <!-- Footer -->
      <div style="padding:18px 36px 24px;border-top:1px solid #f0ede8;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:monospace;font-size:10px;color:#aaa89f;letter-spacing:0.5px;">© 2026 FINTRACK</span>
        <span style="font-family:monospace;font-size:10px;color:#aaa89f;">fintrack.app</span>
      </div>

    </div>
  </div>
  `
);

      return { message: 'OTP code sent successfully! Please check your email.' };
    } catch (error) {
      console.error('======= DEBUG SMTP FORGOT ERROR =======');
      console.error(error);
      console.error('=======================================');
      throw new BadRequestException('Failed to send OTP email. Please check your SMTP configuration.');
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const resetRecord = await this.prisma.passwordReset.findFirst({
      where: { email: dto.email, otp: dto.otp },
      orderBy: { createdAt: 'desc' },
    });

    if (!resetRecord) {
      throw new BadRequestException('Invalid OTP code or email does not match!');
    }

    const now = new Date();
    if (now > resetRecord.expiresAt) {
      throw new BadRequestException('OTP code has expired. Please request a new one!');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.newPassword, salt);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { email: dto.email },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordReset.deleteMany({
        where: { email: dto.email },
      }),
    ]);

    return { message: 'Password reset successfully! Please login with your new password.' };
  }
}