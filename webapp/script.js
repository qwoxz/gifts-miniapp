const tg = window.Telegram.WebApp;
tg.expand();
tg.MainButton.hide();

const symbols = ["🍒", "🍋", "🍉", "🍇", "⭐", "💎"];

const spinButton = document.getElementById("spin");
const result = document.getElementById("result");

spinButton.textContent = "Играть за 5⭐";

spinButton.addEventListener("click", () => {
  // Открываем встроенную оплату через Stars
  const invoiceUrl = `${tg.initDataUnsafe.start_param || ""}/invoice`; // пример
  tg.openInvoice(
    `${import.meta.env?.VITE_INVOICE_URL || "https://yourdomain.com"}/pay?amount=5`,
    (status) => {
      console.log("Invoice status:", status);
      if (status === "paid") {
        playSlot();
      } else {
        result.textContent = "Оплата отменена ❌";
      }
    }
  );
});

function playSlot() {
  const reels = [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  document.getElementById("reel1").textContent = reels[0];
  document.getElementById("reel2").textContent = reels[1];
  document.getElementById("reel3").textContent = reels[2];

  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    tg.HapticFeedback.impactOccurred("heavy");
    result.textContent = "🎉 Джекпот! +10⭐";
    // Уведомляем бота о выигрыше
    fetch("/win", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query_id: tg.initDataUnsafe.query_id, prize: 10 }),
    });
  } else {
    tg.HapticFeedback.impactOccurred("light");
    result.textContent = "😢 Попробуй снова!";
  }
}
