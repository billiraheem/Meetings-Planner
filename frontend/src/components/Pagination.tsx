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
            text="Prev"
            icon="⬅"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
        />

        <span>Page {currentPage} of {totalPages}</span>

        <CustomButton 
            text="Next"
            icon="➡"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
        />
      </div>
    );
  };