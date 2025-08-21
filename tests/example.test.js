import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';
import fetch from 'node-fetch';

describe('Server tests', () => {
  let serverProcess;

  beforeAll(() => {
    serverProcess = spawn('node', ['server/index.js']);
    return new Promise((resolve) => {
      serverProcess.stdout.on('data', (data) => {
        if (data.toString().includes('listening on *:3000')) {
          resolve();
        }
      });
    });
  });

  afterAll(() => {
    serverProcess.kill();
  });

  it('should start the server and respond with the index.html page', async () => {
    const response = await fetch('http://localhost:3000');
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain('<title>Real-time Overlay</title>');
  });
});
