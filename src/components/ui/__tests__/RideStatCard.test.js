import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RideStatCard from '../RideStatCard';

describe('RideStatCard', () => {
  // 基本渲染測試
  test('renders without crashing', () => {
    render(<RideStatCard />);
    expect(screen.getByText('騎行統計')).toBeInTheDocument();
  });

  // 預設值測試
  test('displays default values when no props are provided', () => {
    render(<RideStatCard />);
    
    expect(screen.getByText('0 km')).toBeInTheDocument();
    expect(screen.getByText('0 min')).toBeInTheDocument();
    expect(screen.getByText('騎行統計')).toBeInTheDocument();
  });

  // Props 傳遞測試
  test('displays correct distance and time when props are provided', () => {
    const testProps = {
      distance: '15.5 km',
      time: '45 min',
      title: '今日騎行'
    };

    render(<RideStatCard {...testProps} />);
    
    expect(screen.getByText('15.5 km')).toBeInTheDocument();
    expect(screen.getByText('45 min')).toBeInTheDocument();
    expect(screen.getByText('今日騎行')).toBeInTheDocument();
  });

  // 標籤文字測試
  test('displays correct labels for distance and time', () => {
    render(<RideStatCard />);
    
    expect(screen.getByText('距離')).toBeInTheDocument();
    expect(screen.getByText('時間')).toBeInTheDocument();
  });

  // CSS 類別測試
  test('applies custom className when provided', () => {
    const customClass = 'custom-test-class';
    const { container } = render(<RideStatCard className={customClass} />);
    
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass(customClass);
  });

  // 結構測試
  test('has correct structure with grid layout', () => {
    render(<RideStatCard />);
    
    // 檢查是否有網格佈局
    const gridElement = screen.getByText('距離').closest('.grid');
    expect(gridElement).toHaveClass('grid-cols-2');
  });

  // 樣式測試
  test('has correct styling classes', () => {
    const { container } = render(<RideStatCard />);
    const cardElement = container.firstChild;
    
    // 檢查主要樣式類別
    expect(cardElement).toHaveClass('bg-white');
    expect(cardElement).toHaveClass('rounded-xl');
    expect(cardElement).toHaveClass('shadow-lg');
    expect(cardElement).toHaveClass('border-l-4');
    expect(cardElement).toHaveClass('border-red-500');
  });

  // 圖示測試
  test('renders MapPin and Clock icons', () => {
    const { container } = render(<RideStatCard />);
    
    // 檢查 SVG 元素是否存在（Lucide React 圖示會渲染為 SVG）
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
    
    // 檢查是否有 MapPin 圖示的特徵路徑
    const mapPinPath = container.querySelector('path[d*="20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0"]');
    expect(mapPinPath).toBeInTheDocument();
    
    // 檢查是否有 Clock 圖示的特徵元素
    const clockCircle = container.querySelector('circle[cx="12"][cy="12"][r="10"]');
    expect(clockCircle).toBeInTheDocument();
  });

  // 數值格式測試
  test('handles different distance and time formats', () => {
    const testCases = [
      { distance: '0.5 km', time: '5 min' },
      { distance: '100 km', time: '180 min' },
      { distance: '25.75 km', time: '90 min' }
    ];

    testCases.forEach(({ distance, time }) => {
      const { rerender } = render(<RideStatCard distance={distance} time={time} />);
      
      expect(screen.getByText(distance)).toBeInTheDocument();
      expect(screen.getByText(time)).toBeInTheDocument();
      
      rerender(<div />); // 清理
    });
  });

  // 可訪問性測試
  test('has proper accessibility structure', () => {
    render(<RideStatCard title="測試標題" />);
    
    // 檢查標題是否使用正確的語義標籤
    const titleElement = screen.getByText('測試標題');
    expect(titleElement.tagName).toBe('H3');
  });
}); 