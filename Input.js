{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww38200\viewh20880\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Input.js\
export const inputs = \{\
    forward: false,\
    reverse: false,\
    left: false,\
    right: false,\
    brake: false\
\};\
\
export function initInput() \{\
    console.log("Initializing Input Listener...");\
    \
    document.addEventListener('keydown', (e) => handleKey(e.key.toLowerCase(), true));\
    document.addEventListener('keyup', (e) => handleKey(e.key.toLowerCase(), false));\
\}\
\
function handleKey(key, isDown) \{\
    if (key === 'w' || key === 'arrowup') inputs.forward = isDown;\
    if (key === 's' || key === 'arrowdown') inputs.reverse = isDown;\
    if (key === 'a' || key === 'arrowleft') inputs.left = isDown;\
    if (key === 'd' || key === 'arrowright') inputs.right = isDown;\
    if (key === ' ') inputs.brake = isDown;\
\}}