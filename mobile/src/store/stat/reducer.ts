/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import { createDataLoaderReducer } from "../dataloader/reducer";
import { Graph } from "../../core/stat";
import { STAT_PREFIX } from "./";

export default createDataLoaderReducer<Graph>(STAT_PREFIX);
