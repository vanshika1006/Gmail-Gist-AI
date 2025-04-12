package com.email.services;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.email.entities.EmailRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value; 
@Service
public class EmailGeneratorService {
	
	private final WebClient webClient;
	
	public EmailGeneratorService(WebClient.Builder webClient) {
		this.webClient = webClient.build();
	}

	@Value("${gemini.api.url}")
	private String geminiApiUrl;
	
	@Value("${gemini.api.key}")
	private String geminiApiKey;
	
	public String generateEmailReply(EmailRequest emailRequest) {
		// build a prompt
		String prompt = replyPrompt(emailRequest);
		// craft a request
		Map<String,Object> requestBody = Map.of(
				"contents", new Object[] {
					Map.of( "parts", new Object[] {
							Map.of( "text",prompt
									)
					}
							
					)
					
				}
		);
				
		// do request and get response
		String response = webClient.post()
				.uri(geminiApiUrl + geminiApiKey)	
				.header("Content-Type","application/json")
				.bodyValue(requestBody)
				.retrieve()
				.bodyToMono(String.class)
				.block();
		// return response
		return extractResponseContent(response);
	}

	private String extractResponseContent(String response) {
		
		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonNode rootNode = mapper.readTree(response);
			return rootNode.path("candidates")
					.get(0)
					.get("content")
					.get("parts")
					.get(0)
					.get("text")
					.asText();
		}catch(Exception e) {
			return "Error processing request: "+ e.getMessage();
		}
	}

	private String replyPrompt(EmailRequest emailRequest) {
	    StringBuilder prompt = new StringBuilder();
	    prompt.append("Generate an email reply ");
	    
	    if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
	        prompt.append("in a ").append(emailRequest.getTone()).append(" tone. ");
	    }

	    prompt.append("Do not include a subject line.\n");
	    prompt.append("Also please don't generate multiple options, give only one option without any starting statements from your side so that user can directly copy-paste.\n");
	    prompt.append("Original email:\n").append(emailRequest.getEmailContent());

	    return prompt.toString();
	}

	public String summarise(EmailRequest emailRequest) {
		// build a prompt
		String prompt = summaryPrompt(emailRequest);
		
		// craft a request
		Map<String,Object> requestBody = Map.of(
				"contents", new Object[] {
					Map.of( "parts", new Object[] {
							Map.of( "text",prompt
									)
					}
							
					)
					
				}
		);
						
		// do request and get response
		String response = webClient.post()
						.uri(geminiApiUrl + geminiApiKey)	
						.header("Content-Type","application/json")
						.bodyValue(requestBody)
						.retrieve()
						.bodyToMono(String.class)
						.block();
		
		// return response
		return extractResponseContent(response);
	}

	private String summaryPrompt(EmailRequest emailRequest) {
		StringBuilder sb = new StringBuilder();
		sb.append("Generate a summary for the given email in about 60-70% of its original length.\n");
		sb.append("Do include a crisp-clear subject line summarising the mail content.");
		sb.append("Don't provide any starting statements or introductions from your side so that the user can directly copy-paste.\n");
		sb.append("Also please provide the summary in a structured format like in the form of sub-headings and pointers.\n");
		sb.append("Original Mail: \n");
		sb.append(emailRequest.getEmailContent());
		return sb.toString();
	}

	public String itentReply(EmailRequest emailRequest) {
		// build a prompt
		String prompt = intentPrompt(emailRequest);
		// craft a request
		Map<String,Object> requestBody = Map.of(
				"contents", new Object[] {
					Map.of( "parts", new Object[] {
							Map.of( "text",prompt
									)
					}
								
					)
					
				}
		);
				
		// do request and get response
		String response = webClient.post()
		      			.uri(geminiApiUrl + geminiApiKey)	
						.header("Content-Type","application/json")
						.bodyValue(requestBody)
						.retrieve()
						.bodyToMono(String.class)
						.block();
		// return response
		return extractResponseContent(response);
	}

	
	private String intentPrompt(EmailRequest emailRequest) {
	    StringBuilder sb = new StringBuilder();

	    sb.append("You are an AI email assistant. Your task is to generate a full, well-written email reply in a ");
	    sb.append(emailRequest.getTone()).append(" tone.\n\n");
	    sb.append("Don't include the subject line.\n");

	    sb.append("Here is the original email received:\n");
	    sb.append(emailRequest.getEmailContent()).append("\n\n");

	    sb.append("The user would like to respond with the following intent:\n");
	    sb.append(emailRequest.getIntent()).append("\n\n");

	    sb.append("Using this intent and the email above, write a complete and polite email reply. ");
	    sb.append("Make sure it matches the given tone. Don't include anything from yourself — only the email reply.\n\n");

	    sb.append("Reply:\n");

	    return sb.toString();
	}



}
