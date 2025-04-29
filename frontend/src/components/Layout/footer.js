import React from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const Footer = () => {
    return (
        <Box sx={{ backgroundColor: '#EEEEEE', color: '#7D0A0A', padding: '2rem 0', fontFamily: 'Poppins, sans-serif' }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            MealMile
                        </Typography>
                        <IconButton color="inherit" href="#" aria-label="Facebook">
                            <FacebookIcon />
                        </IconButton>
                        <IconButton color="inherit" href="#" aria-label="Instagram">
                            <InstagramIcon />
                        </IconButton>
                        <IconButton color="inherit" href="#" aria-label="YouTube">
                            <YouTubeIcon />
                        </IconButton>
                        <IconButton color="inherit" href="#" aria-label="LinkedIn">
                            <LinkedInIcon />
                        </IconButton>
                        <IconButton color="inherit" href="#" aria-label="Twitter">
                            <TwitterIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            About Us
                        </Typography>
                        <Link href="#" sx={{ display: 'block', marginBottom: '0.5rem', color: '#7D0A0A', textDecoration: 'none' }}>
                            How It Works
                        </Link>
                        <Link href="#" sx={{ display: 'block', marginBottom: '0.5rem', color: '#7D0A0A', textDecoration: 'none' }}>
                            Our Partners
                        </Link>
                        <Link href="#" sx={{ display: 'block', marginBottom: '0.5rem', color: '#7D0A0A', textDecoration: 'none' }}>
                            Careers
                        </Link>
                        <Link href="/review" sx={{ display: 'block',marginBottom: '0.5rem', color: '#7D0A0A', textDecoration: 'none' }}>
                            Review & Ratings
                        </Link>
                        <Link href="#" sx={{ display: 'block', color: '#7D0A0A', textDecoration: 'none' }}>
                            Contact Us
                        </Link>
                        
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Services
                        </Typography>
                        <Link href="#" sx={{ display: 'block', marginBottom: '0.5rem', color: '#7D0A0A', textDecoration: 'none' }}>
                            Order Food
                        </Link>
                        <Link href="#" sx={{ display: 'block', marginBottom: '0.5rem', color: '#7D0A0A', textDecoration: 'none' }}>
                            Track Order
                        </Link>
                        <Link href="#" sx={{ display: 'block', color: '#7D0A0A', textDecoration: 'none' }}>
                            Become a Rider
                        </Link>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Contact Us
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <EmailIcon sx={{ marginRight: '0.5rem', color: '#7D0A0A' }} />
                            <Link href="mailto:mealmile@gmail.com" sx={{ color: '#7D0A0A', textDecoration: 'none' }}>
                                mealmile@gmail.com
                            </Link>
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon sx={{ marginRight: '0.5rem', color: '#7D0A0A' }} />
                            <Link href="tel:+94110000000" sx={{ color: '#7D0A0A', textDecoration: 'none' }}>
                                +94 110 000 000
                            </Link>
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid #7D0A0A', paddingTop: '1rem' }}>
                    <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                        © {new Date().getFullYear()} MealMile. All Rights Reserved.{' '}
                        <Link href="#" sx={{ color: '#7D0A0A', textDecoration: 'none' }}>
                            Terms & Conditions
                        </Link>{' '}
                        |{' '}
                        <Link href="#" sx={{ color: '#7D0A0A', textDecoration: 'none' }}>
                            Privacy Policy
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
