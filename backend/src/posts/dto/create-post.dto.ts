import { IsString, IsNotEmpty, MaxLength, IsOptional, IsEnum } from 'class-validator';

export enum PostType {
  TEXT = 'text',
  IMAGE = 'image',
  LINK = 'link',
  POLL = 'poll',
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;

  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  @IsString()
  communityId?: string;

  @IsOptional()
  @IsString()
  scheduledFor?: string;
}
