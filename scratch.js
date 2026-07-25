const body = {
  contents: [{
    parts: [
      { text: "Respond with Hello World" }
    ]
  }]
};
fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=INVALID", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body)
}).then(res => res.text()).then(console.log).catch(console.error);
