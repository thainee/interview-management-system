package com.ims.ims_be;

import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@OpenAPIDefinition(
		info = @Info(
				title = "Interview Management System REST APIs",
				description = "API documentation for the Interview Management System. This system provides " +
						"functionalities for managing candidates, jobs, offers, schedule and users.",
				version = "v1.0",
				contact = @Contact(
						name = "HN24_CPL_PJB_02 / Team 5 / GitLab",
						url = "https://git.fa.edu.vn/hn24_cpl_pjb_02/team-5/interview-management-system"
				)
		),
		externalDocs = @ExternalDocumentation(
				description = "Interview Management System Detail Design Documentation",
				url = "https://fptsoftware362-my.sharepoint.com/:x:/r/personal/thaivh9_fpt_com/Documents/IMS_ScreenDesign_v1.0.xlsm?d=wa40b5a2ba40e435bbcf2833b79383204&csf=1&web=1&e=AEeGNI"
		)
)
public class ImsBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(ImsBeApplication.class, args);
	}

}
