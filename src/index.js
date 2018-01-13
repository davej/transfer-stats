/* @flow */
/**
 * Track download/upload and provide transfer stats
 */

const FixedArray = require('fixed-array');

module.exports = class Transfer {
  bpsLog: FixedArray;
  bytesTotal: ?number;
  lastBytesCompleted: number;
  bytesCompleted: number;
  started: boolean;
  finished: boolean;
  startDateTime: ?number;
  updatedDateTime: ?number;
  lastUpdatedDateTime: ?number;
  endDateTime: ?number;
  stats: {};

  constructor(options: { bytesTotal: number, bytesCompleted: number }) {
    this.bpsLog = FixedArray(5);
    const settings = typeof options === 'object' ? options : {};
    this.bytesTotal =
      typeof settings.bytesTotal === 'number' ? settings.bytesTotal : null;
    this.bytesCompleted =
      typeof settings.bytesCompleted === 'number' ? settings.bytesCompleted : 0;
    this.lastBytesCompleted = this.bytesCompleted;
    this.startDateTime = null;
    this.started = false;
    this.finished = false;
    const klass = this;

    this.stats = {
      get started(): boolean {
        return klass.started;
      },
      get finished(): boolean {
        return klass.finished;
      },
      get bytesTotal(): ?number {
        return klass.bytesTotal;
      },
      get bytesCompleted(): number {
        return klass.bytesCompleted;
      },
      get startDateTime(): ?number {
        return klass.startDateTime;
      },
      get endDateTime(): ?number {
        return klass.endDateTime;
      },
      get percentage(): ?number {
        const { bytesRemaining, bytesTotal } = this;
        if (
          typeof bytesRemaining !== 'number' ||
          typeof bytesTotal !== 'number'
        )
          return null;
        return parseFloat((1 - bytesRemaining / bytesTotal).toFixed(10));
      },

      get bytesRemaining(): ?number {
        const { bytesTotal, bytesCompleted } = this;
        if (typeof bytesTotal !== 'number') return null;
        return bytesTotal - bytesCompleted;
      },

      get msElapsed(): number {
        const { startDateTime } = this;
        if (!startDateTime) return 0;
        const currentDateTime: number = new Date().getTime();
        return currentDateTime - startDateTime;
      },

      get bytesPerSecond(): number {
        const { bpsLog } = klass;
        return bpsLog.mean();
      },

      get bytesPerSecondSharp(): number {
        // Get's the exact BPS of the last update rather than the mean of the last 5
        const { bpsLog } = klass;
        const bpsArr = bpsLog.values();
        return bpsArr[bpsArr.length - 1];
      },

      get msTotal(): ?number {
        const { bytesPerSecond, bytesTotal } = this;
        if (typeof bytesTotal !== 'number') return null;
        return Math.floor(bytesTotal / bytesPerSecond * 1000);
      },

      get msRemaining(): ?number {
        const { msTotal, msElapsed, bytesRemaining } = this;
        if (typeof msTotal !== 'number') return null;
        if (bytesRemaining === 0) return 0;
        return msTotal - msElapsed;
      },
    };
  }

  updateBytes(newBytesCompleted: number) {
    if (!this.started) {
      throw new Error(
        'Transfer not started. Call start() before you call updateBytes()',
      );
    }
    const lastBytesCompleted = this.bytesCompleted || 0;
    const currentTime = new Date().getTime();
    const lastUpdatedDateTime = this.updatedDateTime || new Date().getTime();
    const updatedDateTime = currentTime;
    const bps =
      (newBytesCompleted - lastBytesCompleted) /
      (updatedDateTime - lastUpdatedDateTime) *
      1000;

    this.bpsLog.push((bps: number));
    this.lastUpdatedDateTime = lastUpdatedDateTime;
    this.updatedDateTime = updatedDateTime;
    this.bytesCompleted = newBytesCompleted;
    this.lastBytesCompleted = lastBytesCompleted;
  }

  start() {
    this.started = true;
    if (!this.startDateTime) {
      const currentTime = new Date().getTime();
      this.startDateTime = currentTime;
      this.lastUpdatedDateTime = currentTime;
      this.updatedDateTime = currentTime;
    }
  }

  finish() {
    this.finished = true;
    this.started = false;
    this.endDateTime = new Date().getTime();
  }
};
