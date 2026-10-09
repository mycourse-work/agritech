# Worked example: Amazon Quick

It's Sunday night. Hannah has the three Ridgeback documents on the laptop and wants the helper ready before Priya starts at 5 tomorrow. Here's how she does it in one tool, Amazon Quick.

> **On the farm:** The hard part, choosing documents and writing instructions, is already done from lesson 1. The clicking is quick, as long as you finish it. One missed button at the end and Monday's helper doesn't exist.

## Learning outcomes

By the end of this lesson, you will be able to:

- Put farm documents into an Amazon Quick space.
- Create a chat agent, add your instructions and link it to the space.
- Test the agent in the preview and launch it so it's saved.
- Find the same steps in the AI tool you already use.

## Before you start

Amazon Quick has a [Free plan](https://aws.amazon.com/quick/pricing/) you can sign up to with an email address, and it includes spaces and custom chat agents. The Free plan is for one user, so sharing the helper with staff needs a paid plan. Plans change, so check the pricing page first. If your Quick account belongs to a business, an administrator has to give you permission to create chat agents, as the [chat agents guide](https://docs.aws.amazon.com/quick/latest/userguide/custom-agents.html) explains.

We use Quick here because its user guide sets out each step. The last section shows where the same steps sit in other tools.

## Step 1: Put the documents in a space

A space is a collection of documents your chat agent can read. From the [guide to creating a space](https://docs.aws.amazon.com/quick/latest/userguide/creating-spaces.html):

1. In the left-hand menu, select **Spaces**, then **Create space**.
2. Give it a name, such as "Ridgeback staff documents", and a short description.
3. Select **Add knowledge**, choose **File uploads** and add the three files: the handbook, the equipment list and this week's jobs list.
4. Check the **Space knowledge** list shows all three files.

## Step 2: Create the chat agent

1. In the left-hand menu, select **Chat agents**, then **Create chat agent**.
2. Quick opens the **Agent Creator**, which can draft the setup from a description. Select **Skip** to set it up yourself with the instructions you've already written.
3. Name it "Ridgeback helper" and add a description, such as "Answers staff questions from the handbook, equipment list and weekly jobs."
4. Under **Agent persona**, paste your six instruction lines from lesson 1 into **Persona instructions**.
5. Under **Communication style**, a **Length** line such as "Keep answers under 80 words" suits a phone screen.

## Step 3: Link the space

1. Under **Knowledge sources**, select **Link**.
2. Choose the "Ridgeback staff documents" space and select **Link** again. Quick shows a message when it's linked.
3. Leave **Actions** empty. Actions connect the agent to other systems, and a staff question helper doesn't need them.

The guide says a linked agent answers from the language model's own knowledge plus the linked space. So the space limits where it looks, but the model can still add general knowledge. That's why the "answer only from the documents" line stays in.

Under **Customization** you can add a welcome message and **Suggested prompts** such as "Where do visitors sign in?"

## Step 4: Test in the preview

Select **Update preview**, then ask questions in the preview chat. Run the three tests from lesson 3: an answer that's in the documents, one that isn't, and one where two documents disagree. If an answer is wrong, change the instructions or documents, select **Update preview** again and re-ask.

Hannah types:

```text
The quad has a flat tyre. What do I do?
```

The answer she wants back:

```text
Take the quad's key off the key board in the implement shed, hang the red
"Do not use" tag in its place, tell Jack, and write the fault on the list
inside the shed door. Source: Equipment and maintenance list, "If something
is broken or unsafe".
```

## Step 5: Launch it

When the tests pass, select **Launch chat agent**. Until you launch, the agent isn't saved. Leave the setup page without launching and Quick deletes the preview.

A launched agent is private until you share it with staff. Once it's shared, every edit you launch goes straight to everyone using it, so re-test in the preview first.

## The same steps in other tools

| Tool | Where the documents go | Where the instructions go |
| --- | --- | --- |
| ChatGPT | Project or custom GPT files | Its instructions box |
| Claude | Project knowledge | Project instructions |
| Google Gemini | Files added to a Gem | The Gem's instructions |
| Microsoft Copilot | Knowledge sources for an agent | The agent's instructions |

Menus move around as these tools update, but you'll always find somewhere for documents and somewhere for instructions.

## Try it

Hannah sets everything up and runs two of the three tests in the preview. Then a cow starts calving in the paddock by the house, so she closes the laptop. On Monday morning, Priya can't find the Ridgeback helper anywhere.

<div class="reflection" data-id="ai-for-farmers-intro-build-a-helper-amazon-quick" data-min-chars="40">
<div class="reflection-prompt">Why can't Priya find it, and what should Hannah do differently next time?</div>
<div class="reflection-answer">

**Model response:** Hannah never selected Launch chat agent, so the preview was deleted when she left. Even launched, it would stay private until she shared it. The space with the documents should still be there. Next time she should keep the instructions in a note so they're quick to paste back, finish the third test, then launch and share before she walks away.

</div>
</div>

## Key takeaways

- In Amazon Quick, documents go in a space and the helper is a chat agent linked to that space.
- Select Skip in the Agent Creator to set the agent up yourself with your own instructions.
- A linked agent can still use general knowledge, so keep the "only from the documents" line.
- Test in the preview, then select Launch chat agent. Leaving without launching deletes the preview.
- Other tools have the same parts under different names.

The clicks take a few minutes. The documents you chose and the testing you're about to do are what make the helper worth using.
