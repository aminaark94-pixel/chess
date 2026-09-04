import React from 'react';
import { PieceType, PieceColor } from '../types/chess';

interface PieceSvgProps {
  type: PieceType;
  color: PieceColor;
  className?: string;
  isGlowing?: boolean;
}

export const ChessPieceSvg: React.FC<PieceSvgProps> = ({
  type,
  color,
  className = 'w-full h-full drop-shadow-md',
  isGlowing = false
}) => {
  const isWhite = color === 'w';
  const fill = isWhite ? '#ffffff' : '#1e293b';
  const stroke = isWhite ? '#0f172a' : '#f8fafc';
  const highlight = isWhite ? '#f1f5f9' : '#0f172a';
  const accent = isWhite ? '#38bdf8' : '#e2e8f0';

  const glowStyle = isGlowing
    ? { filter: 'drop-shadow(0px 0px 8px rgba(34, 197, 94, 0.9))' }
    : {};

  switch (type) {
    case 'p': // Pawn (Piyada)
      return (
        <svg
          viewBox="0 0 45 45"
          className={className}
          style={glowStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.5 9C20.01 9 18 11.01 18 13.5C18 15.54 19.36 17.25 21.23 17.81C19.78 18.57 18.5 20.31 18.5 23C18.5 25.1 19.5 27.5 20.5 29H15C13.5 29 12 30.5 12 32C12 33 13 34 14 34.5C13.5 35 13 36 13 37C13 38.5 14.5 40 16 40H29C30.5 40 32 38.5 32 37C32 36 31.5 35 31 34.5C32 34 33 33 33 32C33 30.5 31.5 29 30 29H24.5C25.5 27.5 26.5 25.1 26.5 23C26.5 20.31 25.22 18.57 23.77 17.81C25.64 17.25 27 15.54 27 13.5C27 11.01 24.99 9 22.5 9Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 37H28"
            stroke={stroke}
            strokeWidth="1.5"
          />
          <circle cx="22.5" cy="13.5" r="3" fill={accent} fillOpacity="0.4" />
        </svg>
      );

    case 'n': // Knight (Ghora)
      return (
        <svg
          viewBox="0 0 45 45"
          className={className}
          style={glowStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 10C20.5 10 17 11.5 16 14C15 16.5 15.5 18 14 19C12.5 20 10 21 9.5 23C9 25 10 26.5 11.5 26C13 25.5 15 24 16 24C16.5 26 18 28.5 20 30H15C13.5 30 12 31.5 12 33C12 34 13 35 14 35.5C13.5 36 13 37 13 38C13 39.5 14.5 41 16 41H29C30.5 41 32 39.5 32 38C32 37 31.5 36 31 35.5C32 35 33 34 33 33C33 31.5 31.5 30 30 30H26C28 27.5 31 23 31 17C31 11 26 10 22 10Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="15.5" cy="17" r="1.5" fill={isWhite ? '#0284c7' : '#f59e0b'} />
          <path
            d="M19 14.5C21 13 24 13.5 26 15.5"
            stroke={stroke}
            strokeWidth="1.5"
          />
          <path
            d="M21 21C22.5 19.5 25 19 27 20"
            stroke={stroke}
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'b': // Bishop (Feel / Oont)
      return (
        <svg
          viewBox="0 0 45 45"
          className={className}
          style={glowStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.5 6C21.67 6 21 6.67 21 7.5C21 8.33 21.67 9 22.5 9C23.33 9 24 8.33 24 7.5C24 6.67 23.33 6 22.5 6Z"
            fill={accent}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <path
            d="M17.5 16C15 19 14.5 24 17 28C18.5 29 20 29.5 22.5 29.5C25 29.5 26.5 29 28 28C30.5 24 30 19 27.5 16C26 14 24.5 11 22.5 11C20.5 11 19 14 17.5 16Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 32C13.5 32 12 33.5 12 35C12 36 13 37 14 37.5C13.5 38 13 39 13 40C13 41.5 14.5 43 16 43H29C30.5 43 32 41.5 32 40C32 39 31.5 38 31 37.5C32 37 33 36 33 35C33 33.5 31.5 32 30 32H15Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M22.5 14V26M18 19H27"
            stroke={stroke}
            strokeWidth="1.5"
          />
          <path
            d="M20 18L26 23"
            stroke={accent}
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'r': // Rook (Haathi / Qila)
      return (
        <svg
          viewBox="0 0 45 45"
          className={className}
          style={glowStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 11V16H15V13H18V16H21V13H24V16H27V13H30V16H33V11H12Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M14 16L16 28H29L31 16H14Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M14 31C12.5 31 11 32.5 11 34C11 35 12 36 13 36.5C12.5 37 12 38 12 39C12 40.5 13.5 42 15 42H30C31.5 42 33 40.5 33 39C33 38 32.5 37 32 36.5C33 36 34 35 34 34C34 32.5 32.5 31 31 31H14Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M16 22H29"
            stroke={accent}
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'q': // Queen (Wazir / Malika)
      return (
        <svg
          viewBox="0 0 45 45"
          className={className}
          style={glowStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="9" cy="13" r="2" fill={accent} stroke={stroke} strokeWidth="1.5" />
          <circle cx="15.5" cy="10" r="2" fill={accent} stroke={stroke} strokeWidth="1.5" />
          <circle cx="22.5" cy="9" r="2.2" fill={accent} stroke={stroke} strokeWidth="1.5" />
          <circle cx="29.5" cy="10" r="2" fill={accent} stroke={stroke} strokeWidth="1.5" />
          <circle cx="36" cy="13" r="2" fill={accent} stroke={stroke} strokeWidth="1.5" />
          <path
            d="M9 15L12 28H33L36 15L29 21L22.5 13L16 21L9 15Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M13 31C11.5 31 10 32.5 10 34C10 35 11 36 12 36.5C11.5 37 11 38 11 39C11 40.5 12.5 42 14 42H31C32.5 42 34 40.5 34 39C34 38 33.5 37 33 36.5C34 36 35 35 35 34C35 32.5 33.5 31 32 31H13Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M14 26C18 28 27 28 31 26"
            stroke={accent}
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'k': // King (Badshah)
      return (
        <svg
          viewBox="0 0 45 45"
          className={className}
          style={glowStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Royal Cross on Crown */}
          <path
            d="M22.5 5V12M19 8.5H26"
            stroke={isWhite ? '#eab308' : '#fbbf24'}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14 16C11 18 10 23 13 27C15 28.5 18 29.5 22.5 29.5C27 29.5 30 28.5 32 27C35 23 34 18 31 16C28 13.5 26 12.5 22.5 12.5C19 12.5 17 13.5 14 16Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M13 32C11.5 32 10 33.5 10 35C10 36 11 37 12 37.5C11.5 38 11 39 11 40C11 41.5 12.5 43 14 43H31C32.5 43 34 41.5 34 40C34 39 33.5 38 33 37.5C34 37 35 36 35 35C35 33.5 33.5 32 32 32H13Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="22.5" cy="20" r="3" fill={highlight} stroke={stroke} strokeWidth="1.2" />
        </svg>
      );

    default:
      return null;
  }
};
