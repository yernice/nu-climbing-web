import type { Access } from 'payload'

// Content the public site shows. Anything without explicit access stays admin-only (Payload's default).
export const anyone: Access = () => true
