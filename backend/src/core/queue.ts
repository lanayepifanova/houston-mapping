import { randomUUID } from "crypto";

export type JobStatus = "queued" | "running" | "succeeded" | "failed";

export type JobRecord<Payload = unknown, Result = unknown> = {
  id: string;
  name: string;
  payload: Payload;
  status: JobStatus;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
  result?: Result;
  error?: string;
};

type Runner<Payload, Result> = (payload: Payload) => Promise<Result>;

export class JobQueue {
  private queue: string[] = [];
  private jobs = new Map<string, JobRecord>();
  private runners = new Map<string, Runner<any, any>>();
  private concurrency: number;
  private active = 0;
  private maxRetention: number;

  constructor(opts?: { concurrency?: number; maxRetention?: number }) {
    this.concurrency = opts?.concurrency ?? 2;
    this.maxRetention = opts?.maxRetention ?? 200;
  }

  registerRunner<Payload, Result>(name: string, runner: Runner<Payload, Result>) {
    this.runners.set(name, runner);
  }

  enqueue<Payload>(name: string, payload: Payload): JobRecord<Payload> {
    if (!this.runners.has(name)) {
      throw new Error(`No runner registered for job ${name}`);
    }

    const job: JobRecord<Payload> = {
      id: randomUUID(),
      name,
      payload,
      status: "queued",
      createdAt: Date.now()
    };

    this.jobs.set(job.id, job);
    this.queue.push(job.id);
    void this.tick();

    this.trimRetention();
    return job;
  }

  getJob(id: string) {
    return this.jobs.get(id);
  }

  private async tick() {
    if (this.active >= this.concurrency) return;
    const nextId = this.queue.shift();
    if (!nextId) return;

    const job = this.jobs.get(nextId);
    if (!job) return;

    const runner = this.runners.get(job.name);
    if (!runner) {
      job.status = "failed";
      job.error = `Missing runner for ${job.name}`;
      return;
    }

    this.active += 1;
    job.status = "running";
    job.startedAt = Date.now();

    try {
      const result = await runner(job.payload);
      job.result = result;
      job.status = "succeeded";
    } catch (err) {
      job.status = "failed";
      job.error = err instanceof Error ? err.message : "Unknown error";
    } finally {
      job.finishedAt = Date.now();
      this.active -= 1;
      void this.tick();
    }
  }

  private trimRetention() {
    if (this.jobs.size <= this.maxRetention) return;
    const sorted = Array.from(this.jobs.values()).sort((a, b) => a.createdAt - b.createdAt);
    const surplus = sorted.length - this.maxRetention;
    for (let i = 0; i < surplus; i++) {
      this.jobs.delete(sorted[i].id);
    }
  }
}
