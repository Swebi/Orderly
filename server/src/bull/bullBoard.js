import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { scraperQueue, calendarQueue } from "./queue.js";

export const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/dashboard");

const bullBoard = createBullBoard({
  queues: [new BullMQAdapter(scraperQueue), new BullMQAdapter(calendarQueue)],
  serverAdapter: serverAdapter,
});
