# Emojic Mirror

The Emojic Mirror is an interactive digital artefact that explores the use of emojis and emotion detection. Can you express all the eight supported emotions? And what happens if multiple people try it at the same time? Try the [live demo](https://efduarte.github.io/emojic-mirror/) hosted on GitHub Pages, or install it locally on your machine and find out. 

## Setup

Setting up Emojic Mirror is simple:

1. First, go grab a [Microsoft Cognitive Services Emotion API key](https://azure.microsoft.com/en-us/services/cognitive-services/emotion/)
2. Then, edit the following line in `js/script.js` with your new API key:

```
xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","YOUR-API-KEY-HERE!");
```

3. There is no third step, you are ready to go!

## Known Limitations

Our [live demo](https://efduarte.github.io/emojic-mirror/) hosted on GitHub Pages uses a standard free account from Microsoft Cognitive Services. To avoid exceeding the free quota and breaking the example, it only sends a request every five seconds. However, if multiple people open the live demo at the same time, it may exceed the quota anyway and a local install with your own API key may be needed. Furthermore, keep in mind that you will need to allow the browser to access your webcam (you may need to refresh the page after giving this permission), and, for security reasons, this feature only works over the `https` protocol or locally.