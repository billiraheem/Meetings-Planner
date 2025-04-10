import { CustomButton } from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="pagination">
      <CustomButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="prev"
      >
        Prev
      </CustomButton>

      <span>Page {currentPage} of {totalPages}</span>

      <CustomButton
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="next"
      >
        Next
      </CustomButton>
    </div>
  );
};