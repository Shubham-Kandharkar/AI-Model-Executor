package com.executor.queries.controller;
import com.executor.queries.MessagePrompt;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/query")
public class QueryController {

    private final ChatClient chatClient;

    public QueryController(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    @PostMapping("/prompt")
    public ResponseEntity<Object> aiResponseController(@RequestBody MessagePrompt message){
        System.out.println("Query from user: " +  message.promptMessage());
        String responseFromAi = chatClient.prompt().user(message.promptMessage()).call().content();
        return new ResponseEntity<>(responseFromAi, HttpStatus.OK);
    }


}
