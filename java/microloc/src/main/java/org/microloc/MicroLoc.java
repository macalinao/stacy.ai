package org.microloc;

import com.textrazor.TextRazor;
import com.textrazor.annotations.AnalyzedText;
import com.textrazor.annotations.Entity;
import com.textrazor.annotations.NounPhrase;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.ocpsoft.prettytime.nlp.PrettyTimeParser;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static spark.Spark.post;

/**
 * Created by john on 9/19/15.
 */
public class MicroLoc {
    public static void main(String[] args) {
        post("/lt", (req, res) -> {
            String text = req.queryParams("text");
            List<Date> dates = new PrettyTimeParser().parse(text);
            JSONObject jsonObject = new JSONObject();
            for (Date date : dates) {
                jsonObject.put("time",date.toInstant().atZone(ZoneId.systemDefault()).format(DateTimeFormatter.ISO_INSTANT));
            }
            TextRazor textRazor = new TextRazor("4f093cd3431832cbcc0633e25cbaf04e3c35259f387709874faadaa2");
            textRazor.addExtractor("phrases");
            textRazor.addExtractor("entities");
            AnalyzedText analyzedText = textRazor.analyze(text);
            String[] words = text.split(" ");
            JSONArray jsonArray = new JSONArray();
            List<String> locations = new ArrayList<>();
            List<String> cleanLocations = new ArrayList<String>();
            for (Entity entity : analyzedText.getResponse().getEntities()) {
                locations.add(entity.getMatchedText());
                cleanLocations.add(entity.getEntityId());
            }
            for (NounPhrase nounPhrase : analyzedText.getResponse().getNounPhrases()) {
                String wordList = "";
                for (int pos : nounPhrase.getWordPositions()) {
                    wordList += words[pos] + " ";
                }
                wordList = wordList.trim();
                if (locations.contains(wordList) || wordList.equalsIgnoreCase("i")) {
                    continue;
                }

                jsonArray.add(wordList);
            }
            jsonObject.put("locations", cleanLocations);
            return jsonObject.toJSONString();
        });
    }
}
