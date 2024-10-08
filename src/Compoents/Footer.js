import React, { useState } from 'react';
import styled from 'styled-components';
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const FooterContainer = styled.footer`
  position: relative;
  width: 100%;
  min-height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(to bottom, #E6F3FF, #FFFFFF);
  color: #333;
  padding: 48px 0;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  padding: 0 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 24px;
  font-weight: bold;
  color: #4A90E2;
  margin-bottom: 16px;
`;

const Subtitle = styled.h4`
  font-size: 18px;
  font-weight: bold;
  color: #4A90E2;
  margin-bottom: 16px;
`;

const Text = styled.p`
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 16px;
`;

const SocialLink = styled.a`
  color: #4A90E2;
  transition: color 0.3s ease;
  &:hover {
    color: #2171cd;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  margin-bottom: 8px;
`;

const Link = styled.a`
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
  &:hover {
    color: #4A90E2;
  }
`;

const ContactItem = styled.p`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
`;

const ContactIcon = styled.span`
  margin-right: 8px;
  color: #4A90E2;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Input = styled.input`
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  color: #fff;
  background-color: #4A90E2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #2171cd;
  }
`;

const Copyright = styled.p`
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
`;

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subscribed:', email);
    setEmail('');
  };

  return (
    <FooterContainer>
      <ContentWrapper>
        <Grid>
          <Column>
            <Title>Mental Peace</Title>
            <Text>Cultivating inner calm and balance in your daily life.</Text>
            <SocialIcons>
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <SocialLink key={index} href="#">
                  <Icon size={20} />
                </SocialLink>
              ))}
            </SocialIcons>
          </Column>
          
          <Column>
            <Subtitle>Quick Links</Subtitle>
            <List>
              {['Home', 'About', 'Services', 'Blog', 'Contact'].map((item) => (
                <ListItem key={item}>
                  <Link href="#">{item}</Link>
                </ListItem>
              ))}
            </List>
          </Column>
          
          <Column>
            <Subtitle>Contact Us</Subtitle>
            {[
              { Icon: MapPin, text: '123 Serenity Lane, Mindful City' },
              { Icon: Phone, text: '+1 (555) 123-4567' },
              { Icon: Mail, text: 'info@mentalpeace.com' },
            ].map(({ Icon, text }, index) => (
              <ContactItem key={index}>
                <ContactIcon><Icon size={16} /></ContactIcon>
                <span>{text}</span>
              </ContactItem>
            ))}
          </Column>
          
          <Column>
            <Subtitle>Newsletter</Subtitle>
            <Text>Subscribe for tips on mindfulness and mental well-being.</Text>
            <Form onSubmit={handleSubmit}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <Button type="submit">Subscribe</Button>
            </Form>
          </Column>
        </Grid>
        
        <Copyright>
          © 2024 Mental Peace. All rights reserved.
        </Copyright>
      </ContentWrapper>
    </FooterContainer>
  );
};

export default Footer;