$(function()
{
    Webcam.set({
        width: 1280,
        height: 720,
        image_format: "jpeg",
        jpeg_quality: 30
    });
    Webcam.attach("#my-camera");
    setTimeout(captureAlert, 4000);
});

function captureAlert ()
{
    $("#my-camera").css("border", "40px solid yellow");
    setTimeout(verifyEmotion, 1000);
}

function verifyEmotion()
{
    $("#my-camera").css("border", "40px solid green");

    Webcam.snap(function(data_uri)
    {
        $.ajax({
            url: "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize",
            beforeSend: function(xhrObj)
            {
                xhrObj.setRequestHeader("Content-Type","application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","f643f83b07eb44ceb085ebb49e788b72");
            },
            processData: false,
            type: "POST",
            data: makeblob(data_uri)
        })
        .done(function(data)
        {
            $("#my-camera").css("border", "40px solid #CCCCCC");
            $("#emotion").html("");
            if (data[0])
            {
                var angerSum = 0;
                var contemptSum = 0;
                var disgustSum = 0;
                var fearSum = 0;
                var happinessSum = 0;
                var neutralSum = 0;
                var sadnessSum = 0;
                var surpriseSum = 0;
                
                data.forEach(function(person)
                {
                    var anger = Math.round(person.scores.anger * 100) / 100;
                    var contempt = Math.round(person.scores.contempt * 100) / 100;
                    var disgust = Math.round(person.scores.disgust * 100) / 100;
                    var fear = Math.round(person.scores.fear * 100) / 100;
                    var happiness = Math.round(person.scores.happiness * 100) / 100;
                    var neutral = Math.round(person.scores.neutral * 100) / 100;
                    var sadness = Math.round(person.scores.sadness * 100) / 100;
                    var surprise = Math.round(person.scores.surprise * 100) / 100;
                    
                    angerSum = anger + angerSum;
                    contemptSum = contempt + contemptSum;
                    disgustSum = disgust + disgustSum;
                    fearSum = fear + fearSum;
                    happinessSum = happiness + happinessSum;
                    neutralSum = neutral + neutralSum;
                    sadnessSum = sadness + sadnessSum;
                    surpriseSum = surprise + surpriseSum;
                    
                    var emoji;
                    if (anger > 0.5) { emoji = "😡"; }
                    if (contempt > 0.5) { emoji = "😒"; }
                    if (disgust > 0.5) { emoji = "😰"; }
                    if (fear > 0.5) { emoji = "😱"; }
                    if (happiness > 0.5) {  emoji = "😁";  }
                    if (neutral > 0.5) { emoji = "😐"; }
                    if (sadness > 0.5) { emoji = "😭"; }
                    if (surprise > 0.5) { emoji = "😯"; }

                    $("#emotion").append(emoji);
                });

                angerAvg = angerSum / data.length;
                contemptAvg = contemptSum / data.length;
                disgustAvg = disgustSum / data.length;
                fearAvg = fearSum / data.length;
                happinessAvg = happinessSum / data.length;
                neutralAvg = neutralSum / data.length;
                sadnessAvg = sadnessSum / data.length;
                surpriseAvg = surpriseSum / data.length;

                $("#anger").width(angerAvg * 200);
                $("#contempt").width(contemptAvg * 200);
                $("#disgust").width(disgustAvg * 200);
                $("#fear").width(fearAvg * 200);
                $("#happiness").width(happinessAvg * 200);
                $("#neutral").width(neutralAvg * 200);
                $("#sadness").width(sadnessAvg * 200);
                $("#surprise").width(surpriseAvg * 200);

                var opacity;
                if (data.length < 1) { opacity = "0" }
                else if (data.length >= 1) { opacity = "1" }

                if (angerAvg > 0.5) { selectVideo("anger", opacity); }
                else if (contemptAvg > 0.5) { selectVideo("contempt", opacity) }
                else if (disgustAvg > 0.5) { selectVideo("disgust", opacity) }
                else if (fearAvg > 0.5) { selectVideo("fear", opacity) }
                else if (happinessAvg > 0.5) { selectVideo("happiness", opacity) }
                else if (neutralAvg > 0.5) { selectVideo("neutral", "1") }
                else if (sadnessAvg > 0.5) { selectVideo("sadness", opacity) }
                else if (surpriseAvg > 0.5) { selectVideo("surprise", opacity) }    
                else { selectVideo("neutral", "1"); }
            }

            else {

                selectVideo("neutral", "1");

                $("#anger").width(0);
                $("#contempt").width(0);
                $("#disgust").width(0);
                $("#fear").width(0);
                $("#happiness").width(0);
                $("#neutral").width(0);
                $("#sadness").width(0);
                $("#surprise").width(0);

            }

        })
        .fail(function(e) {
            console.log(e);
        });
    });

    setTimeout(captureAlert, 4000);
}

function selectVideo(emotion, opacity)
{
    $("#video-anger").css("opacity", "0");
    $("#video-contempt").css("opacity", "0");
    $("#video-disgust").css("opacity", "0");
    $("#video-fear").css("opacity", "0");
    $("#video-happiness").css("opacity", "0");
    $("#video-neutral").css("opacity", "1");
    $("#video-sadness").css("opacity", "0");
    $("#video-surprise").css("opacity", "0");
    if (emotion == "anger") { $("#video-anger").css("opacity", opacity); }
    if (emotion == "contempt") { $("#video-contempt").css("opacity", opacity); }
    if (emotion == "disgust") { $("#video-disgust").css("opacity", opacity); }
    if (emotion == "fear") { $("#video-fear").css("opacity", opacity); }
    if (emotion == "happiness") { $("#video-happiness").css("opacity", opacity); }
    if (emotion == "neutral") { $("#video-neutral").css("opacity", opacity); }
    if (emotion == "sadness") { $("#video-sadness").css("opacity", opacity); }
    if (emotion == "surprise") { $("#video-surprise").css("opacity", opacity); }
}

document.body.onkeydown = function(e){
    if (e.keyCode == 32) //SPACE
    {
        e.preventDefault();
        if ($("#my-camera").css("visibility") == "hidden")
        {
            $("#my-camera").css("visibility", "visible");
        }
        else
        {
            $("#my-camera").css("visibility", "hidden");
        }
    }
}

function makeblob(dataURL)
{
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1)
    {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i)
    {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}