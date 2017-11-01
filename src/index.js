/* @flow */
/**
 * Track download/upload and provide transfer stats
 */
module.exports = class Transfer {
  bytesTotal: ?number;
  bytesCompleted: number;
  started: boolean;
  finished: boolean;
  startDateTime: ?number;
  endDateTime: ?number;
  stats: {};

  constructor(options: { bytesTotal: number, bytesCompleted: number }) {
    const settings = typeof options === 'object' ? options : {};
    this.bytesTotal =
      typeof settings.bytesTotal === 'number' ? settings.bytesTotal : null;
    this.bytesCompleted =
      typeof settings.bytesCompleted === 'number' ? settings.bytesCompleted : 0;
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
        const { bytesCompleted, msElapsed } = this;
        return bytesCompleted / msElapsed * 1000;
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

  updateBytes(bytes: number) {
    if (!this.started) {
      throw new Error(
        'Transfer not started. Call start() before you call updateBytes()',
      );
    }
    this.bytesCompleted = bytes;
  }

  start() {
    this.started = true;
    if (!this.startDateTime) this.startDateTime = new Date().getTime();
  }

  finish() {
    this.finished = true;
    this.started = false;
    this.endDateTime = new Date().getTime();
  }
};
