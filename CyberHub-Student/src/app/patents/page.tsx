import ActivityModule from "@/components/ActivityModule/ActivityModule";

export default function PatentsPage() {
  return <ActivityModule activityType="PATENT" title="Patents" subtitle="Track intellectual property applications and granted patents." eyebrow="Innovation" itemLabel="Patent" fields={[
    { key: "title", label: "Patent title", placeholder: "Enter the patent title" },
    { key: "applicationNo", label: "Application or grant number", placeholder: "Enter application number" },
    { key: "details", label: "Patent details", placeholder: "Add inventors, filing date, or status", multiline: true },
  ]} />;
}
