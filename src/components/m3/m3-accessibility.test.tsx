/**
 * M3 컴포넌트 접근성 테스트
 * WCAG 2.1 AA 기준 검증
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TextField } from './TextField';
import { Chip } from './Chip';
import { Card } from './Card';
import { Dialog } from './Dialog';

expect.extend(toHaveNoViolations);

describe('M3 Accessibility Tests', () => {
  describe('TextField', () => {
    it('axe 접근성 위반 없음', async () => {
      const { container } = render(
        <TextField label="이메일" placeholder="example@email.com" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('label과 input이 올바르게 연결됨', () => {
      render(<TextField label="사용자 이름" />);
      const input = screen.getByLabelText('사용자 이름');
      expect(input).toBeInTheDocument();
    });

    it('에러 상태에서 aria-invalid 적용', () => {
      render(<TextField label="비밀번호" error errorText="필수 항목입니다" />);
      const input = screen.getByLabelText('비밀번호');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('supportingText가 aria-describedby로 연결됨', () => {
      render(
        <TextField
          label="이름"
          supportingText="실명을 입력하세요"
        />
      );
      const input = screen.getByLabelText('이름');
      const describedById = input.getAttribute('aria-describedby');
      expect(describedById).toBeTruthy();
      expect(screen.getByText('실명을 입력하세요')).toHaveAttribute('id', describedById);
    });

    it('키보드로 포커스 가능', async () => {
      const user = userEvent.setup();
      render(<TextField label="검색" />);

      await user.tab();
      expect(screen.getByLabelText('검색')).toHaveFocus();
    });
  });

  describe('Chip', () => {
    it('axe 접근성 위반 없음', async () => {
      const { container } = render(
        <Chip variant="filter">필터 옵션</Chip>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('aria-pressed로 선택 상태 표시', () => {
      render(<Chip variant="filter" selected>선택됨</Chip>);
      expect(screen.getByRole('button', { name: '선택됨' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('미선택 상태에서 aria-pressed="false"', () => {
      render(<Chip variant="filter">미선택</Chip>);
      expect(screen.getByRole('button', { name: '미선택' })).toHaveAttribute('aria-pressed', 'false');
    });

    it('키보드로 활성화 가능', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Chip onClick={handleClick}>클릭</Chip>);

      await user.tab();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalled();
    });

    it('터치 타겟 최소 32px 높이', () => {
      render(<Chip>테스트</Chip>);
      const chip = screen.getByRole('button');
      // min-h-[32px] 클래스 확인
      expect(chip.className).toContain('min-h-[32px]');
    });
  });

  describe('Card', () => {
    it('axe 접근성 위반 없음', async () => {
      const { container } = render(
        <Card>
          <h3>카드 제목</h3>
          <p>카드 내용입니다.</p>
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Dialog', () => {
    it('axe 접근성 위반 없음', async () => {
      const { container } = render(
        <Dialog
          open={true}
          onClose={() => {}}
          title="확인"
          actions={[{ label: '닫기', onClick: () => {} }]}
        >
          <p>내용입니다.</p>
        </Dialog>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('role="dialog"와 aria-modal 속성', () => {
      render(
        <Dialog open={true} onClose={() => {}} title="테스트">
          내용
        </Dialog>
      );
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('aria-labelledby로 제목 연결', () => {
      render(
        <Dialog open={true} onClose={() => {}} title="중요 알림">
          내용
        </Dialog>
      );
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title');
      expect(screen.getByText('중요 알림')).toHaveAttribute('id', 'dialog-title');
    });

    it('ESC 키로 닫기 가능', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <Dialog open={true} onClose={handleClose} title="닫기 테스트">
          내용
        </Dialog>
      );

      // Dialog 내에서 ESC 키 누르기 (fireEvent 사용)
      const dialog = screen.getByRole('dialog');
      await user.type(dialog, '{Escape}');
      expect(handleClose).toHaveBeenCalled();
    });

    it('dismissible=false면 ESC로 닫히지 않음', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <Dialog open={true} onClose={handleClose} title="강제 다이얼로그" dismissible={false}>
          내용
        </Dialog>
      );

      const dialog = screen.getByRole('dialog');
      await user.type(dialog, '{Escape}');
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('Color Contrast (시각적 검증)', () => {
    it('M3 색상 토큰 클래스가 적용됨', () => {
      const { container } = render(<Chip>테스트</Chip>);
      const chip = container.querySelector('button');
      // M3 색상 토큰 클래스 참조 확인
      expect(chip?.className).toContain('text-m3-on-surface');
    });
  });

  describe('Keyboard Navigation', () => {
    it('연속 탭으로 모든 인터랙티브 요소 접근 가능', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <TextField label="입력1" />
          <Chip>칩1</Chip>
          <Chip>칩2</Chip>
          <button>버튼</button>
        </div>
      );

      await user.tab();
      expect(screen.getByLabelText('입력1')).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: '칩1' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: '칩2' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: '버튼' })).toHaveFocus();
    });
  });
});
