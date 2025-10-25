import {type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// Hook dùng để dispatch action có type an toàn
export const useAppDispatch: () => AppDispatch = useDispatch;

// Hook dùng để lấy state từ store có type an toàn
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
