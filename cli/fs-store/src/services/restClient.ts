import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const commonAxiosConfig = {
  validateStatus: () => true, // any status code resolves, but a network problem
  timeout: 5000,
};

export class RestClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setHost(host: string) {
    if (host) {
      this.baseUrl = host;
    } else {
      throw Error('Invalid host');
    }
  }

  getHost() {
    return this.baseUrl;
  }

  async getFilesOnServer() {
    const response = await axios({
      method: 'GET',
      baseURL: this.baseUrl,
      url: '/api/files',
      ...commonAxiosConfig,
    });

    return response.data;
  }

  async uploadFileOnServer(filePath: string) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    const response = await axios({
      method: 'POST',
      baseURL: this.baseUrl,
      url: '/api/files',
      data: formData,
      ...commonAxiosConfig,
      headers: {
        ...formData.getHeaders(),
      },
    });
    return response.data;
  }

  async deleteFileOnServer(id: string) {
    const response = await axios({
      method: 'DELETE',
      baseURL: this.baseUrl,
      url: `/api/files/${id}`,
      ...commonAxiosConfig,
    });

    return response.data;
  }
}
