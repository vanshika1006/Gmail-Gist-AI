package com.email.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.email.entities.EmailRequest;
import com.email.services.EmailGeneratorService;


@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
public class EmailGeneratorController {
	private final EmailGeneratorService emailGeneratorService;

	public EmailGeneratorController(EmailGeneratorService emailGeneratorService) {
		this.emailGeneratorService = emailGeneratorService;
	}

	@PostMapping("/generate")
	public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest){
		String response = emailGeneratorService.generateEmailReply(emailRequest);
		return ResponseEntity.ok(response);
	}
	
	@PostMapping("/summarise")
	public ResponseEntity<String> summarise(@RequestBody EmailRequest emailRequest){
		String summary = emailGeneratorService.summarise(emailRequest);
		return ResponseEntity.ok(summary);
	}
	
	@PostMapping("/intent")
	public ResponseEntity<String> intentReply(@RequestBody EmailRequest emailRequest){
		String response = emailGeneratorService.itentReply(emailRequest);
		return ResponseEntity.ok(response);
	}
}
