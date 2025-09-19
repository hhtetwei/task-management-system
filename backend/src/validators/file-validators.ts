import {
    BadRequestException,
    createParamDecorator,
    ExecutionContext,
  } from '@nestjs/common';
  
  interface ValidateFilesOptions {
    required?: boolean;
    maxSize?: number;
    allowedTypes?: string[];
  }
  
  export const ValidateFiles = createParamDecorator(
    (
      options: { [field: string]: ValidateFilesOptions },
      ctx: ExecutionContext,
    ) => {
      const request = ctx.switchToHttp().getRequest();
      const files = request.files;
  
      // Loop through each field to validate
      for (const field in options) {
        const fieldOptions = options[field];
        const fileArray = files[field];
  
        // Required field validation
        if (fieldOptions.required && (!fileArray || fileArray.length === 0)) {
          throw new BadRequestException(`${field} file is required.`);
        }
  
        // File-specific validation
        if (fileArray && fileArray.length > 0) {
          for (const file of fileArray) {
            // File size validation
            if (fieldOptions.maxSize && file.size > fieldOptions.maxSize) {
              throw new BadRequestException(
                `${field} file size exceeds ${fieldOptions.maxSize / (2 * 1024 * 1024)}MB limit.`,
              );
            }
  
            // File type validation
            if (fieldOptions.allowedTypes) {
              const isValidType = fieldOptions.allowedTypes.some((type) =>
                file.mimetype.includes(type),
              );
              if (!isValidType) {
                throw new BadRequestException(
                  `Invalid file type for ${field}. Allowed types: ${fieldOptions.allowedTypes.join(', ')}.`,
                );
              }
            }
          }
        }
      }
  
      return files;
    },
  );
  