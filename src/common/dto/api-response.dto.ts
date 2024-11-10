// src/common/dto/api-response.dto.ts
export class ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  
    constructor(data: T, message = 'success', success = true) {
      this.success = success;
      this.message = message;
      this.data = data;
    }
  }
  