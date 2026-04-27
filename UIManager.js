{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww38200\viewh20880\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // UIManager.js\
export let speedElement;\
\
export function initUI() \{\
    console.log("Initializing HUD...");\
    // Grab the span element we made in index.html\
    speedElement = document.getElementById('speed');\
\}\
\
export function updateUI(chassisBody) \{\
    if (!speedElement) return;\
    \
    // chassisBody.velocity.length() gives us meters per second. \
    // Multiply by 3.6 to get KM/H\
    const velocity = chassisBody.velocity.length();\
    const kmh = Math.round(velocity * 3.6);\
    \
    speedElement.innerText = kmh;\
\}}