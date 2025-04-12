package com.email.entities;

import lombok.Data;

@Data
public class EmailRequest {
	private String emailContent;
	private String tone;
	private String intent;
	
	public String getEmailContent() {
		return emailContent;
	}
	public void setEmailContent(String emailContent) {
		this.emailContent = emailContent;
	}
	public String getTone() {
		return tone;
	}
	public void setTone(String tone) {
		this.tone = tone;
	}
	
	public EmailRequest(String emailContent, String tone, String intent) {
		super();
		this.emailContent = emailContent;
		this.tone = tone;
		this.intent = intent;
	}
	
	public EmailRequest() {
		super();
	}
	public String getIntent() {
		return intent;
	}
	public void setIntent(String intent) {
		this.intent = intent;
	}
	
}
