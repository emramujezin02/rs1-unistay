import { Component } from '@angular/core';

interface AboutSection {
  title: string;
  imageUrl: string;
  paragraphs: string[];
  imagePosition: 'left' | 'right';
}

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  sections: AboutSection[] = [
    {
      title: 'What is UniStay?',
      imageUrl: 'https://picsum.photos/1200/675?random=13',
      paragraphs: [
        'UniStay is a comprehensive dormitory management system designed to streamline every aspect of student housing. Our mission is to create a comfortable, safe, and efficient living environment, allowing students to focus on their studies and enjoy their university life to the fullest.',
      ],
      imagePosition: 'right'
    },
    {
      title: 'Our Mission',
      imageUrl: 'https://picsum.photos/800/450?random=10',
      paragraphs: [
        'At UniStay, our mission is to revolutionize the student housing experience. We believe that a comfortable, secure, and well-managed living environment is crucial for academic success and personal growth.',
        'We aim to eliminate the traditional hassles of dormitory life by providing a single, intuitive platform that connects students, administrators, and staff, fostering a vibrant and supportive community.'
      ],
      imagePosition: 'left'
    },
    {
      title: 'Our Vision',
      imageUrl: 'https://picsum.photos/800/450?random=15',
      paragraphs: [
        'Our long-term vision is to lead the complete modernization of dormitory services. We are committed to a continuous digital transformation that not only enhances efficiency but also enriches the student living experience.',
        'We plan to introduce seamless integrations with university systems, expand our services to more institutions, and constantly innovate with new features that anticipate the evolving needs of modern students and administrators.'
      ],
      imagePosition: 'right'
    },
    {
      title: 'Who is UniStay For?',
      imageUrl: 'https://picsum.photos/800/450?random=16',
      paragraphs: [
        'UniStay is a unified platform designed for the entire campus housing ecosystem. Students use it for applications, maintenance requests, and staying connected. Dorm Management and Administrative Teams rely on it for streamlined operations, from assignments to analytics. Maintenance Staff receive and manage work orders efficiently, while Security can access necessary information to ensure a safe environment.'
      ],
      imagePosition: 'left'
    },
    {
      title: 'How UniStay Works (Process Overview)',
      imageUrl: 'https://picsum.photos/800/450?random=17',
      paragraphs: [
        'The journey with UniStay is simple and intuitive. It begins with a student submitting an online application. The dorm management team then reviews applications and assigns rooms through the system. Once moved in, students can submit maintenance requests, which are automatically routed to the maintenance staff. Throughout the year, administrators use the platform for announcements, ensuring clear communication and a well-managed community.'
      ],
      imagePosition: 'right'
    },
    {
      title: 'Our Values',
      imageUrl: 'https://picsum.photos/800/450?random=18',
      paragraphs: [
        'Our work is guided by a core set of values: Accessibility to ensure everyone can use our platform with ease; Transparency in all processes for students and staff; Reliability to provide a system that you can always count on; a Student-First Approach that places student well-being at the heart of every decision; and uncompromising Security to protect user data and privacy.'
      ],
      imagePosition: 'left'
    }
  ];
}
