// dsh-timestamp — 时间戳转换（DeepSeek Harness）。
// Unix 时间戳 ↔ ISO 8601 ↔ 相对时间 互转，获取当前时间。纯 Node。
import { defineTool } from "@deepseek-ai/dsh-tools";

const name = "时间戳转换";
const inject = ["tools"];

function fmt(ms) {
  const d = new Date(ms);
  return d.toISOString();
}

function relative(ms) {
  const now = Date.now();
  const diff = ms - now;
  const abs = Math.abs(diff);
  const units = [
    ["年", 365 * 86400e3], ["月", 30 * 86400e3], ["天", 86400e3], ["小时", 3600e3], ["分钟", 60e3], ["秒", 1e3],
  ];
  for (const [label, msPer] of units) {
    if (abs >= msPer) {
      const n = Math.round(abs / msPer);
      return diff > 0 ? `${n} ${label}后` : `${n} ${label}前`;
    }
  }
  return "刚刚";
}

async function apply(ctx, _config) {
  ctx.tools.register(defineTool({
    name: "timestamp_convert",
    description:
      "时间戳转换：Unix 时间戳（秒或毫秒）↔ ISO 8601 字符串 互转，并给出相对时间（如「3 天前」）。`value` 传数字时间戳或 ISO/日期字符串；`unit` 指定时间戳单位（s/ms，默认 s；传字符串时忽略）。用于调试时间逻辑。",
    parameters: {
      value: { type: "json", required: true, description: "时间戳数字，或 ISO/日期字符串。" },
      unit: { type: "string", enum: ["s", "ms"], description: "时间戳单位，默认 s（秒）。" },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: {
          iso: { type: "string", required: true },
          unixSeconds: { type: "integer", required: true },
          unixMs: { type: "integer", required: true },
          relative: { type: "string", required: true },
          local: { type: "string", required: true },
        },
      },
      render: (_args, value) => [{
        type: "text",
        text: `${value.iso}（${value.local}）\nUnix: ${value.unixSeconds} 秒 / ${value.unixMs} 毫秒\n相对：${value.relative}`,
      }],
    },
    execute: async (args) => {
      let ms;
      if (typeof args.value === "number") {
        const v = args.value;
        // 判断秒还是毫秒：>1e12 视为毫秒
        const isMs = args.unit === "ms" || (args.unit !== "s" && Math.abs(v) > 1e12);
        ms = isMs ? v : v * 1000;
      } else {
        const t = Date.parse(String(args.value));
        if (isNaN(t)) throw new Error(`无法解析时间：${args.value}`);
        ms = t;
      }
      const iso = fmt(ms);
      return {
        iso,
        unixSeconds: Math.floor(ms / 1000),
        unixMs: ms,
        relative: relative(ms),
        local: new Date(ms).toString(),
      };
    },
  }));

  ctx.tools.register(defineTool({
    name: "timestamp_now",
    description: "获取当前时间的 Unix 时间戳（秒/毫秒）与 ISO 8601 字符串。",
    parameters: {},
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: {
          iso: { type: "string", required: true },
          unixSeconds: { type: "integer", required: true },
          unixMs: { type: "integer", required: true },
        },
      },
      render: (_args, value) => [{ type: "text", text: `${value.iso}（${value.unixSeconds} 秒）` }],
    },
    execute: async () => {
      const now = Date.now();
      return { iso: new Date(now).toISOString(), unixSeconds: Math.floor(now / 1000), unixMs: now };
    },
  }));
}

export { apply, inject, name };
