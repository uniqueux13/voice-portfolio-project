// src/pages/Presentation.tsx
import React from 'react';

interface Slide {
  title: string;
  content: string;
  imagePath?: string;
}

interface Props {
    slides: Slide[];
    currentSlideIndex: number;
}

const Presentation: React.FC<Props> = ({ slides, currentSlideIndex }) => {
    return (
        <div className="presentation">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`slide ${index === currentSlideIndex ? 'active' : ''}`}
                >
                    <h2>{slide.title}</h2>
                    {slide.imagePath && (
                        <img src={slide.imagePath} alt={slide.title} />
                    )}
                    <p>{slide.content}</p>
                </div>
            ))}
            {/* Remove the entire instructions div */}
        </div>
    );
};

export default Presentation;