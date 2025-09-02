// Mock axios instance
const mockAxiosInstance = {
    put: jest.fn(),
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn()
};

// Mock axios before import
jest.mock('axios', () => ({
    create: jest.fn(() => mockAxiosInstance)
}));

// Import services after mocking
import { putService, postService, getService, deleteService, service } from './services';

describe('services utilities', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('putService', () => {
        it('should call axios put with path and data', async () => {
            const mockResponse = { data: { success: true }, status: 200 };
            mockAxiosInstance.put.mockResolvedValue(mockResponse);
            
            const result = await putService('/api/test', { name: 'test' });
            
            expect(mockAxiosInstance.put).toHaveBeenCalledWith('/api/test', { name: 'test' }, { signal: undefined });
            expect(result).toBe(mockResponse);
        });

        it('should handle put request errors', async () => {
            const mockError = new Error('Network error');
            mockAxiosInstance.put.mockRejectedValue(mockError);
            
            await expect(putService('/api/test', {})).rejects.toThrow('Network error');
        });
    });

    describe('postService', () => {
        it('should call axios post with path and data', async () => {
            const mockResponse = { data: { id: 1 }, status: 201 };
            mockAxiosInstance.post.mockResolvedValue(mockResponse);
            
            const result = await postService('/api/create', { name: 'test' });
            
            expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/create', { name: 'test' }, { signal: undefined });
            expect(result).toBe(mockResponse);
        });

        it('should handle post request errors', async () => {
            const mockError = new Error('Validation error');
            mockAxiosInstance.post.mockRejectedValue(mockError);
            
            await expect(postService('/api/create', {})).rejects.toThrow('Validation error');
        });
    });

    describe('getService', () => {
        it('should call axios get with path', async () => {
            const mockResponse = { data: { items: [] }, status: 200 };
            mockAxiosInstance.get.mockResolvedValue(mockResponse);
            
            const result = await getService('/api/items');
            
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/items', { signal: undefined });
            expect(result).toBe(mockResponse);
        });

        it('should handle get request errors', async () => {
            const mockError = new Error('Not found');
            mockAxiosInstance.get.mockRejectedValue(mockError);
            
            await expect(getService('/api/nonexistent')).rejects.toThrow('Not found');
        });
    });

    describe('deleteService', () => {
        it('should call axios delete with path', async () => {
            const mockResponse = { data: null, status: 204 };
            mockAxiosInstance.delete.mockResolvedValue(mockResponse);
            
            const result = await deleteService('/api/items/1');
            
            expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api/items/1', { signal: undefined });
            expect(result).toBe(mockResponse);
        });

        it('should handle delete request errors', async () => {
            const mockError = new Error('Forbidden');
            mockAxiosInstance.delete.mockRejectedValue(mockError);
            
            await expect(deleteService('/api/items/1')).rejects.toThrow('Forbidden');
        });
    });

    describe('service exports', () => {
        it('should export the axios service instance', () => {
            expect(service).toBeDefined();
        });

        it('should export all service functions', () => {
            expect(putService).toBeDefined();
            expect(postService).toBeDefined();
            expect(getService).toBeDefined();
            expect(deleteService).toBeDefined();
        });
    });

    describe('custom config', () => {
        it('should support custom config for all methods', async () => {
            const mockResponse = { data: {}, status: 200 };
            mockAxiosInstance.put.mockResolvedValue(mockResponse);
            mockAxiosInstance.post.mockResolvedValue(mockResponse);
            mockAxiosInstance.get.mockResolvedValue(mockResponse);
            mockAxiosInstance.delete.mockResolvedValue(mockResponse);

            const customConfig = { signal: null as any };

            await putService('/test', {}, customConfig);
            await postService('/test', {}, customConfig);
            await getService('/test', customConfig);
            await deleteService('/test', customConfig);

            expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test', {}, customConfig);
            expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', {}, customConfig);
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', customConfig);
            expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test', customConfig);
        });
    });
});