import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ReadOnlyGuard } from '../guards/read-only.guard';

describe('ReadOnlyGuard', () => {
  let guard: ReadOnlyGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadOnlyGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<ReadOnlyGuard>(ReadOnlyGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  const createMockContext = (method: string) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          method,
        }),
      }),
      getClass: () => ({
        name: 'TestController',
      }),
      getHandler: () => ({}),
    } as ExecutionContext;
  };

  describe('canActivate', () => {
    it('should allow GET requests on read-only controllers', () => {
      const context = createMockContext('GET');
      (reflector.get as jest.Mock).mockReturnValue(true);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow HEAD requests on read-only controllers', () => {
      const context = createMockContext('HEAD');
      (reflector.get as jest.Mock).mockReturnValue(true);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow OPTIONS requests on read-only controllers', () => {
      const context = createMockContext('OPTIONS');
      (reflector.get as jest.Mock).mockReturnValue(true);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException for POST requests on read-only controllers', () => {
      const context = createMockContext('POST');
      (reflector.get as jest.Mock).mockReturnValue(true);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'La tabla Test es de solo lectura. Operaciones de escritura (POST) no están permitidas.'
      );
    });

    it('should throw ForbiddenException for PUT requests on read-only controllers', () => {
      const context = createMockContext('PUT');
      (reflector.get as jest.Mock).mockReturnValue(true);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException for PATCH requests on read-only controllers', () => {
      const context = createMockContext('PATCH');
      (reflector.get as jest.Mock).mockReturnValue(true);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException for DELETE requests on read-only controllers', () => {
      const context = createMockContext('DELETE');
      (reflector.get as jest.Mock).mockReturnValue(true);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should allow all requests on non-read-only controllers', () => {
      const context = createMockContext('POST');
      (reflector.get as jest.Mock).mockReturnValue(false);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow all requests when readOnly metadata is not set', () => {
      const context = createMockContext('DELETE');
      (reflector.get as jest.Mock).mockReturnValue(undefined);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });
  });
});
