async function run() {
  const sid = "AC3bb1f6b0ab39ef4d47424002ce30aa12";
  const token = "ad26a4141b29d6ceb3b51fb1c08dbdbf";
  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
                    
  const params = new URLSearchParams();
  params.append("To", "+919898747456");
  params.append("From", "+19706099588");
  params.append("Body", `Test SMS`);

  const authHeader = "Basic " + btoa(`${sid}:${token}`);
  console.log("Auth Header:", authHeader);

  const res = await fetch(twilioUrl, {
      method: "POST",
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": authHeader
      },
      body: params.toString()
  });

  if (!res.ok) {
      console.log("Failed:", await res.text());
  } else {
      console.log("Success:", await res.json());
  }
}
run();
