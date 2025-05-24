# ✨ AI Fine-Tuning Library

This library helps you train your own custom AI models (like GPT-4) using your data — no technical experience required.

---

## 🚀 What You Can Do

- Train a model using your own dataset
- Choose how many records to use
- Track the training status
- Support for OpenAI (GPT-4o, GPT-3.5, etc.)
- More providers coming soon

---

## 🧰 What You Need

1. An API key from OpenAI (or another provider)
2. A URL where your dataset can be downloaded
3. The number of records to use

---

## 🛠️ How to Use

### Example (in code):

```ts
import { createFineTuneJob } from "finetune-model-lib";

const job = await createFineTuneJob({
  provider: "openai",
  dataset_api: "https://yourapp.com/api/dataset?userId=123",
  suffix: "my-model-v1",
  data_size: 1000,
});
```

---

## 📡 Tracking Status

### Example (in code):

```ts
import { OpenAIAdapter } from "your-finetune-lib";

const adapter = new OpenAIAdapter("your-openai-api-key");

const status = await adapter.getStatus("ft-abc123");
console.log("Training status:", status.status);
```

---

## ✅ Best Practices

- Keep your dataset clean and properly formatted
- Use smaller data sizes to test before scaling up
- Store your model IDs in a database so you can reuse them

---
