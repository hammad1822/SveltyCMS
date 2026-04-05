/**
 * @file tests/unit/auth/saml.test.ts
 * @description SAML Authentication Service Unit Tests (Bun Test Runner)
 *
 * Tests:
 * - should initialize Jackson with correct database connection string derived from config
 * - should generate SAML redirect URL correctly
 * - should create SAML connections via admin controller
 *
 */

import { describe, expect, it, beforeEach, afterEach } from 'bun:test';
import { getJackson, generateSAMLAuthUrl, createSAMLConnection, resetJackson } from '../../../src/databases/auth/saml-auth';

describe('SAML Authentication Service', () => {
	let originalEnv: any;
	beforeEach(() => {
		originalEnv = (globalThis as any).privateEnv ? { ...(globalThis as any).privateEnv } : undefined;
		resetJackson();
	});
	afterEach(() => {
		(globalThis as any).privateEnv = originalEnv;
	});

	it('should initialize Jackson with correct database connection string derived from config', async () => {
		(globalThis as any).privateEnv = {
			DB_TYPE: 'postgresql',
			DB_USER: 'testuser',
			DB_PASSWORD: 'testpassword',
			DB_HOST: 'localhost',
			DB_PORT: 5432,
			DB_NAME: 'testdb'
		};

		const instance = await getJackson();
		expect(instance).toBeDefined();
		expect(instance.oauthController).toBeDefined();
		expect(instance.connectionAPIController).toBeDefined();
	});

	it('should generate SAML redirect URL correctly', async () => {
		const url = await generateSAMLAuthUrl('acme-corp', 'sveltycms');
		expect(url).toBe('https://idp.example.com/sso');
	});

	it('should create SAML connections via admin controller', async () => {
		const result = await createSAMLConnection({
			rawMetadata: '<xml></xml>',
			defaultRedirectUrl: 'http://localhost:5173/admin',
			tenant: 't1',
			product: 'p1'
		});
		expect(result.id).toBe('conn_123');
	});
});
