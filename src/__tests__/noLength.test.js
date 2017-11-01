/* eslint-env jest */

const Transfer = require('../');
require('./helpers');

let transfer;
let elapsedTime;
elapsedTime = 0;

const delay = () => {
  elapsedTime += 300;
  return new Promise((resolve: void => void) => setTimeout(resolve, 300));
};

describe('simple transfer flow without content-length', () => {
  it('should create new file transfer', () => {
    transfer = new Transfer();
    expect(transfer.stats.started).toBe(false);
    expect(transfer.stats.finished).toBe(false);
    expect(transfer.stats.bytesCompleted).toBe(0);
    expect(transfer.stats.bytesTotal).toBe(null);
    expect(transfer.stats.bytesRemaining).toBe(null);
    expect(transfer.stats.percentage).toBe(null);
  });

  it('should error when transferring bytes on unstarted transfer', () => {
    expect(() => {
      transfer.updateBytes(50);
    }).toThrow();
  });

  it('should start transfer', () => {
    transfer.start();
    expect(transfer.stats.started).toBe(true);
    expect(transfer.stats.finished).toBe(false);
    expect(transfer.stats.bytesCompleted).toBe(0);
    expect(transfer.stats.bytesRemaining).toBe(null);
    expect(transfer.stats.bytesTotal).toBe(null);
    expect(transfer.stats.percentage).toBe(null);
    return delay();
  });

  it('should transfer data', () => {
    transfer.updateBytes(100);
    expect(transfer.stats.started).toBe(true);
    expect(transfer.stats.finished).toBe(false);
    expect(transfer.stats.bytesCompleted).toBe(100);
    expect(transfer.stats.bytesRemaining).toBe(null);
    expect(transfer.stats.bytesTotal).toBe(null);
    expect(transfer.stats.percentage).toBe(null);
    expect(transfer.stats.msElapsed).toBeWithin20PercentOf(elapsedTime);
    const bps = 333; // 100B / 300MS * 1000;
    expect(transfer.stats.bytesPerSecond).toBeWithin20PercentOf(bps);
    expect(transfer.stats.msTotal).toBe(null);
    expect(transfer.stats.msRemaining).toBe(null);

    return delay();
  });

  it('should transfer more data', () => {
    transfer.updateBytes(500);
    expect(transfer.stats.started).toBe(true);
    expect(transfer.stats.finished).toBe(false);
    expect(transfer.stats.bytesCompleted).toBe(500);
    expect(transfer.stats.bytesRemaining).toBe(null);
    expect(transfer.stats.bytesTotal).toBe(null);
    expect(transfer.stats.percentage).toBe(null);
    expect(transfer.stats.msElapsed).toBeWithin20PercentOf(elapsedTime);
    const bps = 833; // 500B / 600MS * 1000;
    expect(transfer.stats.bytesPerSecond).toBeWithin20PercentOf(bps);
    expect(transfer.stats.msTotal).toBe(null);
    expect(transfer.stats.msRemaining).toBe(null);

    return delay();
  });

  it('should transfer all the data', () => {
    transfer.updateBytes(10000);
    expect(transfer.stats.started).toBe(true);
    expect(transfer.stats.finished).toBe(false);
    expect(transfer.stats.bytesCompleted).toBe(10000);
    expect(transfer.stats.bytesRemaining).toBe(null);
    expect(transfer.stats.bytesTotal).toBe(null);
    expect(transfer.stats.percentage).toBe(null);
    expect(transfer.stats.msElapsed).toBeWithin20PercentOf(elapsedTime);
    const bps = 11111; // 10000B / 900MS * 1000;
    expect(transfer.stats.bytesPerSecond).toBeWithin20PercentOf(bps);
    expect(transfer.stats.msTotal).toBe(null);
    expect(transfer.stats.msRemaining).toBe(null);

    return delay();
  });

  it('should be able to be marked as finished', () => {
    transfer.finish();
    expect(transfer.stats.started).toBe(false);
    expect(transfer.stats.finished).toBe(true);
  });
});
