import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class GetUsersDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  skip?: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  sort = 'createdAt';

  @IsString()
  @IsOptional()
  search?: string;
}
