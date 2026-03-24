import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: "Token d'accès JWT",
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: "Type du token",
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: "Nom d'utilisateur",
    example: 'admin',
  })
  username: string;

  @ApiProperty({
    description: "Rôle de l'utilisateur",
    example: 'admin',
  })
  role: string;
}