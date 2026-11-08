import {describe,it,expect} from 'vitest';
import config from '../next.config';
describe('security headers',()=>{
 it('protects all routes with browser hardening',async()=>{
  const rules=await config.headers?.();
  const headers=rules?.[0]?.headers ?? [];
  expect(headers).toEqual(expect.arrayContaining([{key:'X-Content-Type-Options',value:'nosniff'},{key:'X-Frame-Options',value:'DENY'}]));
  expect(headers.some(h=>h.key==='Referrer-Policy')).toBe(true);
 });
});
