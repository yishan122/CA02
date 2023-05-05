const express = require("express");
const router = express.Router();
const path = require('path');
const APIKEY = process.env.APIKEY;
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey:APIKEY,
});
const openai = new OpenAIApi(configuration);

//$env:APIKEY="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"

isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

// Get the response from the GPT API
async function getResponse(text){
  let gptResponse;
  try {
    console.log("等待中.....")
    gptResponse = await openai.createCompletion({
      prompt: text, 
      max_tokens: 64,
      n: 1,
      temperature: 0.5,
      frequency_penalty: 0,
      presence_penalty: 0,
      model: "text-davinci-003",
    })
    console.log("gptResponse = ", gptResponse.data.choices[0])
    console.log("请求结束.....")
  } catch (error) {
    console.log("erro1111r = ", error)
  }

  return gptResponse.data.choices[0].text;
}



// Route for the poem page
router.get("/index/engine", (req, res) => {
  res.render("engine");
});

// Route to handle poem form submissions
router.post("/index/engine", async (req, res) => {
  try {
    const prompt = "give anwser about: " + req.body.prompt;
    console.log("prompt = ", prompt)
    const answer = await getResponse(prompt);
    console.log("answer = ", answer)
    res.render("engine", { answer });
  } catch (error) {
    console.log("error55555 = ", error)
  }


});


module.exports = router;
