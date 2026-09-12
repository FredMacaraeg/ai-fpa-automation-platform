let
    Config = Excel.CurrentWorkbook(){[Name="tblPQConfig"]}[Content],
    SourcePath = Text.From(Config{0}[SourcePath]),
    Source = Csv.Document(
        File.Contents(SourcePath),
        [Delimiter=",", Columns=8, Encoding=65001, QuoteStyle=QuoteStyle.Csv]
    ),
    PromotedHeaders = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    ChangedTypes = Table.TransformColumnTypes(
        PromotedHeaders,
        {
            {"Period End", type date},
            {"Account Code", type text},
            {"Account Name", type text},
            {"Department", type text},
            {"Data Type", type text},
            {"Source Amount ($mm)", type number},
            {"Source System", type text},
            {"Import Batch", type text}
        }
    ),
    CleanText = Table.TransformColumns(
        ChangedTypes,
        {
            {"Account Code", Text.Trim, type text},
            {"Account Name", Text.Trim, type text},
            {"Department", Text.Trim, type text},
            {"Data Type", Text.Trim, type text},
            {"Source System", Text.Trim, type text},
            {"Import Batch", Text.Trim, type text}
        }
    ),
    FilteredRows = Table.SelectRows(CleanText, each [Account Code] <> null and [Account Code] <> ""),
    AddedRefreshTimestamp = Table.AddColumn(FilteredRows, "Refresh Timestamp", each DateTime.LocalNow(), type datetime)
in
    AddedRefreshTimestamp
