import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import carouselData from '../data/carousel.json';

interface SlideProps {
  slide: typeof carouselData.slides[0];
  onSlideClick: () => void;
}

const Slide: React.FC<SlideProps> = ({ slide, onSlideClick }) => (
  <motion.div
    onClick={onSlideClick}
    className="relative w-[130px] h-[130px] rounded-lg overflow-hidden cursor-pointer mx-1.5 flex-shrink-0 touch-none"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
  >
    <img
      src={slide.image}
      alt={slide.title}
      className="w-full h-full object-cover"
      draggable="false"
    />
  </motion.div>
);

interface CarouselPanelProps {
  slide: typeof carouselData.slides[0];
  isOpen: boolean;
  onClose: () => void;
}

const CarouselPanel: React.FC<CarouselPanelProps> = ({ slide, isOpen, onClose }) => {
  const { setCurrentTab } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-[#160c30] rounded-t-2xl w-full p-6 relative pb-12">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white"
        >
          ✕
        </button>
        <div className="flex flex-col items-center text-center">
          <h3 className="text-xl font-bold text-white mb-2">{slide.title}</h3>
          <p className="text-gray-400 text-sm mb-6">{slide.description}</p>
          <button
            onClick={() => {
              setCurrentTab('tasks');
              onClose();
            }}
            className="w-full bg-[#6C3CE1] text-white py-2.5 rounded-lg font-medium"
          >
            К заданиям
          </button>
        </div>
      </div>
    </div>
  );
};

export const Carousel: React.FC = () => {
  const [selectedSlide, setSelectedSlide] = useState<typeof carouselData.slides[0] | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    setStartX(pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const x = pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX);
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <>
      <div className="mb-3 px-4">
        <h2 className="text-base font-medium text-white">Призы от Медиаракеты</h2>
      </div>
      <div
        ref={carouselRef}
        className="flex overflow-x-auto hide-scrollbar touch-pan-x py-2 px-2 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="flex">
          {carouselData.slides.map((slide) => (
            <Slide
              key={slide.id}
              slide={slide}
              onSlideClick={() => !isDragging && setSelectedSlide(slide)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedSlide && (
          <CarouselPanel
            slide={selectedSlide}
            isOpen={!!selectedSlide}
            onClose={() => setSelectedSlide(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};